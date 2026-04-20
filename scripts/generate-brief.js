require('dotenv').config();
const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const http = require('http');
const https = require('https');
const pLimit = require('p-limit').default;
const sanitizeHtml = require('sanitize-html');

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; DailyBrief/2.0)',
  },
});

const limit = pLimit(5);

// ---------------------------------------------------------------------------
// Feed configuration
// ---------------------------------------------------------------------------
// `rank` is used as a tiebreaker during deduplication: when two feeds cover
// the same story, the lower rank number wins. This makes the output
// deterministic across runs rather than depending on which fetch resolved
// first.
//
// Reuters was removed: their public RSS feeds were discontinued and the
// previous URL was returning nothing.
//
// FT, Telegraph, and Economist feeds are typically headline-only due to
// paywalls. They're kept because they're useful for flagging topics, but
// Claude has limited context to work with from them.
const RSS_FEEDS = [
  // UK News
  { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', maxItems: 8, rank: 1 },
  { name: 'Guardian', url: 'https://www.theguardian.com/uk/rss', maxItems: 8, rank: 2 },
  { name: 'Telegraph', url: 'https://www.telegraph.co.uk/news/rss.xml', maxItems: 6, rank: 3 },

  // Business & Economy
  { name: 'FT', url: 'https://www.ft.com/?format=rss', maxItems: 6, rank: 4 },
  { name: 'The Economist', url: 'https://www.economist.com/latest/rss.xml', maxItems: 4, rank: 5 },
  { name: 'Politico', url: 'https://rss.politico.com/politics-news.xml', maxItems: 4, rank: 6 },

  // Tech & AI
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', maxItems: 4, rank: 7 },
  { name: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index', maxItems: 4, rank: 8 },

  // International
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', maxItems: 4, rank: 9 },
  { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/rss/feed/nar', maxItems: 4, rank: 10 },
];

const MAX_ARTICLE_AGE_HOURS = 36;
const DEFAULT_MAX_PER_FEED = 4;
const MAX_ARTICLES_TOTAL = 40;
const CONTENT_CHAR_LIMIT = 1400;
const MIN_FEEDS_WARNING = 5;
const CLAUDE_MODEL = 'claude-sonnet-4-6';

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------
function buildSystemPrompt() {
  const today = format(new Date(), 'EEEE do MMMM yyyy');

  return `You are writing a morning briefing for a UK-based finance professional. Today is ${today}.

Audience cares about: UK economic policy, global macro trends, AI and technology that affects business, and major geopolitical shifts.

Voice: direct, informed, conversational. Like a colleague who has read the overnight papers and is catching you up over coffee. Not a research note. Not a wire service summary.

Example of the register:

"The Bank held rates at 4.25% yesterday. No surprise there, but Bailey's comments on services inflation were sharper than the minutes suggested they would be. Markets took it as mildly hawkish and sterling firmed half a cent against the dollar.

Separately, OpenAI and Microsoft are reportedly close to restructuring their commercial agreement ahead of the IPO timeline. If the reporting is accurate, Microsoft's preferential pricing window shrinks from 2030 to 2028."

Selection rules:
- Prefer stories that would change how a fund manager thinks about positioning or policy this week. Skip stories that are interesting but not actionable.
- Skip product launches, celebrity gossip, sport, and lifestyle content entirely.
- If multiple sources cover the same story, treat them as one item. Note where they disagree on facts.
- If nothing of consequence happened, say so in one line and stop. Do not manufacture importance.

Writing rules:
- Report what happened and the direct consequence. Skip speculative second-order takes unless a cited analyst is making them.
- Only name a source when quoting a specific figure, forecast, or attributed statement. Otherwise write as if the facts are just true.
- No significance ratings, no word counts in parentheses, no "Key Emerging Trends" headers.
- No bulleted lists of implications or sentiment shifts.
- Keep the whole brief under 600 words.
- Use British English.
- Article snippets may be truncated. Work with what you have. Do not speculate about missing content.

Output format:
- Plain paragraphs separated by blank lines.
- No headers, no bold text, no bullet lists, no section dividers.
- Order: UK policy and economy first, then global macro, then tech and AI, then geopolitics. Omit sections that have no stories.
- End with one specific scheduled event in the next 48 hours: a data release, vote, central bank speaker, or earnings print. If nothing specific is on the calendar, omit this line entirely.`;
}

function buildUserPrompt(articles) {
  const articleTexts = articles
    .map((a) => `[${a.source}] ${a.title}\n${a.content}`)
    .join('\n\n---\n\n');

  return `Here are ${articles.length} articles from the last 36 hours. Pick the ones that matter by the criteria in the system prompt (usually 3 to 7) and write the brief.

Articles:

${articleTexts}`;
}

// ---------------------------------------------------------------------------
// RSS fetching
// ---------------------------------------------------------------------------
async function fetchArticles() {
  const allArticles = [];
  const now = new Date();
  const errors = [];
  let feedsWithResults = 0;

  console.log(`Fetching from ${RSS_FEEDS.length} feeds...`);

  const fetchPromises = RSS_FEEDS.map((feed) =>
    limit(async () => {
      try {
        console.log(`  ${feed.name}...`);
        const feedData = await parser.parseURL(feed.url);

        if (!feedData.items || feedData.items.length === 0) {
          console.warn(`  No items: ${feed.name}`);
          return [];
        }

        const maxItems = feed.maxItems || DEFAULT_MAX_PER_FEED;

        const items = feedData.items
          .filter((item) => {
            if (!item.title || !item.link) return false;
            // Some feeds populate isoDate but leave pubDate empty
            const rawDate = item.pubDate || item.isoDate;
            if (!rawDate) return false;
            const articleDate = new Date(rawDate);
            if (isNaN(articleDate.getTime())) return false;
            const hoursOld = (now - articleDate) / (1000 * 60 * 60);
            return hoursOld <= MAX_ARTICLE_AGE_HOURS;
          })
          .slice(0, maxItems)
          .map((item) => ({
            title: sanitizeHtml(item.title, { allowedTags: [], allowedAttributes: {} }),
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            content: truncateToSentence(
              sanitizeHtml(item.contentSnippet || item.content || '', {
                allowedTags: [],
                allowedAttributes: {},
              }),
              CONTENT_CHAR_LIMIT
            ),
            source: feed.name,
            sourceRank: feed.rank,
          }));

        if (items.length > 0) feedsWithResults++;
        return items;
      } catch (error) {
        const msg = `Error fetching ${feed.name}: ${error.message}`;
        console.error(`  ${msg}`);
        errors.push(msg);
        return [];
      }
    })
  );

  const results = await Promise.allSettled(fetchPromises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      errors.push(`${RSS_FEEDS[index].name} failed: ${result.reason}`);
    }
  });

  console.log(
    `Collected ${allArticles.length} articles from ${feedsWithResults} feeds, ${errors.length} errors`
  );

  if (errors.length > 0) {
    console.warn('Feed errors:\n' + errors.join('\n'));
  }

  if (feedsWithResults < MIN_FEEDS_WARNING) {
    console.warn(
      `Only ${feedsWithResults} feeds returned articles. Brief may be running on thin input.`
    );
  }

  if (allArticles.length === 0) {
    throw new Error('No articles fetched from any feed. Check connectivity and feed URLs.');
  }

  const unique = deduplicateArticles(allArticles);
  console.log(`Deduplicated to ${unique.length} articles`);

  return unique
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, MAX_ARTICLES_TOTAL);
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------
// Deterministic: articles are sorted by source rank before dedup, so the
// preferred source wins any near-duplicate matchup. Same input always
// produces the same output regardless of which feed resolves first.
function deduplicateArticles(articles) {
  const sorted = [...articles].sort((a, b) => a.sourceRank - b.sourceRank);
  const unique = [];
  const seen = [];

  sorted.forEach((article) => {
    const normalised = normaliseTitle(article.title);

    const isDuplicate = seen.some((existing) => {
      // Substring check, but only if the shorter string is long enough
      // to avoid false matches on generic fragments
      const shorter = normalised.length < existing.length ? normalised : existing;
      const longer = normalised.length < existing.length ? existing : normalised;
      if (shorter.length > 20 && longer.includes(shorter)) return true;

      // Ratio-based Levenshtein
      const maxLen = Math.max(normalised.length, existing.length);
      if (maxLen === 0) return true;
      return levenshteinDistance(normalised, existing) / maxLen < 0.3;
    });

    if (!isDuplicate) {
      seen.push(normalised);
      unique.push(article);
    }
  });

  return unique;
}

function normaliseTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ---------------------------------------------------------------------------
// Claude API
// ---------------------------------------------------------------------------
async function generateSummary(articles) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('No ANTHROPIC_API_KEY found, using fallback summary...');
    return { text: generateSimpleSummary(articles), mode: 'fallback' };
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Generating summary with Claude (attempt ${attempt})...`);

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: CLAUDE_MODEL,
          max_tokens: 1500,
          temperature: 0.6,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: buildUserPrompt(articles) }],
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: 60000,
          httpAgent,
          httpsAgent,
        }
      );

      if (!response.data?.content?.[0]?.text) {
        throw new Error('Invalid response from Anthropic API');
      }

      console.log('Claude summary generated successfully');
      return { text: response.data.content[0].text, mode: 'claude' };
    } catch (error) {
      const status = error.response?.status;
      console.error(`Claude API error (attempt ${attempt}):`, error.message);
      if (error.response) {
        console.error('Status:', status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }

      const isRetryable = !error.response || status >= 500 || status === 429;

      if (attempt < maxAttempts && isRetryable) {
        // Honour Retry-After header if present, otherwise exponential with jitter
        let backoffMs;
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          const retryAfterSec = parseInt(retryAfter, 10);
          backoffMs = isNaN(retryAfterSec) ? 5000 : retryAfterSec * 1000;
        } else {
          const base = Math.pow(2, attempt) * 1000;
          const jitter = Math.random() * 1000;
          backoffMs = base + jitter;
        }
        console.log(`Retrying in ${Math.round(backoffMs / 1000)}s...`);
        await sleep(backoffMs);
        continue;
      }

      console.log('Falling back to simple summary...');
      return { text: generateSimpleSummary(articles), mode: 'fallback' };
    }
  }
}

// ---------------------------------------------------------------------------
// Fallback summary
// ---------------------------------------------------------------------------
// Clearly distinct from the main brief format. This is what readers see
// when the API is down, so it should look obviously different rather than
// like a buggy version of the normal brief.
function generateSimpleSummary(articles) {
  const lines = [];
  lines.push('*Automated summary unavailable this morning. Raw headlines below, grouped by source.*');
  lines.push('');

  const grouped = {};
  articles.forEach((a) => {
    if (!grouped[a.source]) grouped[a.source] = [];
    grouped[a.source].push(a);
  });

  Object.entries(grouped).forEach(([source, items]) => {
    lines.push(`**${source}**`);
    items.slice(0, 3).forEach((item) => {
      lines.push(`- [${escapeMarkdown(item.title)}](${item.link})`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Hugo output
// ---------------------------------------------------------------------------
async function generateHugoMarkdown(summary, articles) {
  const today = new Date();
  const readableDate = format(today, 'EEEE, MMMM do, yyyy');

  const sourceLinks = articles
    .map((a) => `- [${escapeMarkdown(a.title)}](${a.link}) — *${a.source}*`)
    .join('\n');

  const sources = [...new Set(articles.map((a) => a.source))].join(', ');

  // Tag fallback days so they're easy to filter/style differently on the site
  const tags = summary.mode === 'fallback'
    ? '["daily-brief", "fallback"]'
    : '["daily-brief"]';

  return `---
title: "Daily Brief — ${readableDate}"
date: ${today.toISOString()}
draft: false
type: "brief"
summary: "Morning brief covering what matters in UK policy, global macro, AI, and geopolitics"
tags: ${tags}
showReadingTime: false
showToc: false
---

${summary.text}

---

## Sources

${sourceLinks}

*${sources} — ${today.toISOString().slice(0, 10)}*
`;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Truncates text to the last complete sentence within the character limit.
 */
function truncateToSentence(text, maxChars) {
  if (!text || text.length <= maxChars) return text;

  const truncated = text.slice(0, maxChars);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('? '),
    truncated.lastIndexOf('! ')
  );

  if (lastSentenceEnd > maxChars * 0.5) {
    return truncated.slice(0, lastSentenceEnd + 1);
  }

  return truncated.trim() + '...';
}

/**
 * Escapes characters that break markdown link syntax.
 */
function escapeMarkdown(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\|/g, '\\|');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  try {
    console.log('=== Daily Brief Generation ===');
    console.log(`Node ${process.version} | ${new Date().toISOString()}`);
    console.log(`API: ${process.env.ANTHROPIC_API_KEY ? 'Anthropic Claude' : 'Fallback (no key)'}`);

    const articles = await fetchArticles();
    console.log(`${articles.length} articles ready`);

    const summary = await generateSummary(articles);
    console.log(`Summary complete (${summary.mode})`);

    const markdown = await generateHugoMarkdown(summary, articles);

    const briefsDir = path.join(process.cwd(), 'content', 'briefs');
    await fs.mkdir(briefsDir, { recursive: true });

    const today = format(new Date(), 'yyyy-MM-dd');
    const filePath = path.join(briefsDir, `${today}.md`);
    await fs.writeFile(filePath, markdown);

    const stats = await fs.stat(filePath);
    console.log(`Saved: ${today}.md (${stats.size} bytes)`);

    await createBriefsIndex(briefsDir);
    console.log('Done.');

    process.exit(0);
  } catch (error) {
    console.error('FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

async function createBriefsIndex(briefsDir) {
  const content = `---
title: "Daily Briefs"
date: ${new Date().toISOString()}
draft: false
summary: "Morning briefs covering UK policy, global macro, AI, and geopolitics"
---

Each morning, an automated script scans ${RSS_FEEDS.length} curated RSS feeds, selects the most relevant stories from the last 36 hours, and passes them to Claude for synthesis into a concise briefing.
`;

  await fs.writeFile(path.join(briefsDir, '_index.md'), content);
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

main();
