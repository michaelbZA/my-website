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
    'User-Agent': 'Mozilla/5.0 (compatible; DailyBrief/2.0)'
  }
});

const limit = pLimit(5);

// Curated feeds — the feed list IS the filter
const RSS_FEEDS = [
  // UK News
  { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml' },
  { name: 'Guardian', url: 'https://www.theguardian.com/uk/rss' },
  { name: 'Telegraph', url: 'https://www.telegraph.co.uk/news/rss.xml' },

  // Business & Economy
  { name: 'The Economist', url: 'https://www.economist.com/latest/rss.xml' },
  { name: 'Reuters', url: 'https://www.rss.reuters.com/news/world' },
  { name: 'Politico', url: 'https://rss.politico.com/politics-news.xml' },

  // Tech & AI
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index' },

  // International
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/rss/feed/nar' },
];

const MAX_ARTICLE_AGE_HOURS = 36;
const MAX_ARTICLES_PER_FEED = 4;
const MAX_ARTICLES_TOTAL = 30;

/**
 * Fetches recent articles from all feeds
 */
async function fetchArticles() {
  const allArticles = [];
  const now = new Date();
  const errors = [];

  console.log(`Fetching from ${RSS_FEEDS.length} feeds...`);

  const fetchPromises = RSS_FEEDS.map(feed =>
    limit(async () => {
      try {
        console.log(`  ${feed.name}...`);
        const feedData = await parser.parseURL(feed.url);

        if (!feedData.items || feedData.items.length === 0) {
          console.warn(`  No items: ${feed.name}`);
          return [];
        }

        return feedData.items
          .filter(item => {
            if (!item.title || !item.link || !item.pubDate) return false;
            const articleDate = new Date(item.pubDate);
            if (isNaN(articleDate.getTime())) return false;
            const hoursOld = (now - articleDate) / (1000 * 60 * 60);
            return hoursOld <= MAX_ARTICLE_AGE_HOURS;
          })
          .slice(0, MAX_ARTICLES_PER_FEED)
          .map(item => ({
            title: sanitizeHtml(item.title, { allowedTags: [], allowedAttributes: {} }),
            link: item.link,
            pubDate: item.pubDate,
            content: sanitizeHtml(item.contentSnippet || item.content || '', {
              allowedTags: [],
              allowedAttributes: {}
            }),
            source: feed.name,
          }));

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

  console.log(`Collected ${allArticles.length} articles, ${errors.length} errors`);

  if (errors.length > 0) {
    console.warn('Feed errors:\n' + errors.join('\n'));
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

/**
 * Generates summary using Claude API, with fallback
 */
async function generateSummary(articles) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('No ANTHROPIC_API_KEY found, using fallback summary...');
    return generateSimpleSummary(articles);
  }

  try {
    console.log('Generating summary with Claude...');

    const articleTexts = articles.map(article =>
      `[${article.source}] ${article.title}\n${article.content.slice(0, 800)}`
    ).join('\n\n---\n\n');

    const systemPrompt = `You are writing a morning briefing for a UK-based finance professional who cares about: UK economic policy, global macro trends, AI and technology that affects business, and major geopolitical shifts.

Write like a sharp colleague sending a morning email, not like a report template. Be direct. Skip anything trivial.

Use British English throughout.`;

    const userPrompt = `Here are ${articles.length} articles from the last 24-48 hours. Pick the 5-7 that actually matter and write a concise brief.

Structure:
- Open with 2-3 sentences on the single most important story and why it matters
- Cover the remaining stories in short paragraphs (2-3 sentences each), grouped naturally — not forced into fixed categories
- End with one line on what to watch over the next day or two

Rules:
- If a story is about product deals, celebrity gossip, sport, or lifestyle content, skip it entirely
- Don't pad. If it's a quiet news day, write fewer words rather than filling space
- No significance ratings, no word counts in parentheses, no "Key Emerging Trends" headers
- No bullet-pointed lists of "implications" or "sentiment shifts"
- Reference the source when it matters for credibility or when sources disagree on the facts
- Keep it under 500 words total

Articles:

${articleTexts}`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 60000,
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
    });

    if (!response.data || !response.data.content || !response.data.content[0]) {
      throw new Error('Invalid response from Anthropic API');
    }

    const summary = response.data.content[0].text;
    console.log('Claude summary generated successfully');
    return summary;

  } catch (error) {
    console.error('Claude API error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('Falling back to simple summary...');
    return generateSimpleSummary(articles);
  }
}

/**
 * Fallback summary when no API key is available
 */
function generateSimpleSummary(articles) {
  console.log('Generating fallback summary...');

  let summary = `*${format(new Date(), 'EEEE, MMMM do, yyyy')} — ${articles.length} articles scanned*\n\n`;

  const grouped = {};
  articles.forEach(a => {
    if (!grouped[a.source]) grouped[a.source] = [];
    grouped[a.source].push(a);
  });

  Object.entries(grouped).forEach(([source, items]) => {
    summary += `**${source}**\n`;
    items.slice(0, 3).forEach(item => {
      summary += `- [${item.title}](${item.link})\n`;
    });
    summary += '\n';
  });

  return summary;
}

/**
 * Builds the Hugo markdown file
 */
async function generateHugoMarkdown(summary, articles) {
  const today = new Date();
  const readableDate = format(today, 'EEEE, MMMM do, yyyy');

  const cleanSummary = summary.replace(/<[^>]*>/g, '');

  // Simple linked list of sources — no snippets
  const sourceLinks = articles
    .map(a => `- [${a.title}](${a.link}) — *${a.source}*`)
    .join('\n');

  const sources = [...new Set(articles.map(a => a.source))].join(', ');

  return `---
title: "Daily Brief — ${readableDate}"
date: ${today.toISOString()}
draft: false
type: "brief"
summary: "Morning brief covering what matters in UK policy, global macro, AI, and geopolitics"
tags: ["daily-brief"]
showReadingTime: false
showToc: false
---

${cleanSummary}

---

## Sources

${sourceLinks}

*${sources} — ${today.toISOString().slice(0, 10)}*
`;
}

/**
 * Deduplicates articles by title similarity
 */
function deduplicateArticles(articles) {
  const unique = [];
  const seen = new Set();

  articles.forEach(article => {
    const normalised = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isDuplicate = Array.from(seen).some(existing =>
      normalised.includes(existing) ||
      existing.includes(normalised) ||
      levenshteinDistance(normalised, existing) < 10
    );

    if (!isDuplicate) {
      seen.add(normalised);
      unique.push(article);
    }
  });

  return unique;
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

/**
 * Main entry point
 */
async function main() {
  try {
    console.log('=== Daily Brief Generation ===');
    console.log(`Node ${process.version} | ${new Date().toISOString()}`);
    console.log(`API: ${process.env.ANTHROPIC_API_KEY ? 'Anthropic Claude' : 'Fallback (no key)'}`);

    const articles = await fetchArticles();
    console.log(`${articles.length} articles ready`);

    const summary = await generateSummary(articles);
    console.log('Summary complete');

    const markdown = await generateHugoMarkdown(summary, articles);

    const briefsDir = path.join(process.cwd(), 'content', 'briefs');
    try {
      await fs.access(briefsDir);
    } catch {
      await fs.mkdir(briefsDir, { recursive: true });
    }

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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

main();
