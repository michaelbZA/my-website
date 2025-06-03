require('dotenv').config();
const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const http = require('http');
const https = require('https');
const pLimit = require('p-limit');
const sanitizeHtml = require('sanitize-html');

// Create agents with keepAlive disabled
const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const parser = new Parser({
  timeout: 30000, // 30 second timeout
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
  }
});

const limit = pLimit(5); // Max 5 concurrent requests

// Diverse news sources for balanced perspective
const RSS_FEEDS = [
  // UK Sources
  { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', lean: 'center' },
  { name: 'Guardian', url: 'https://www.theguardian.com/uk/rss', lean: 'left' },
  { name: 'Telegraph', url: 'https://www.telegraph.co.uk/news/rss.xml', lean: 'right' },
  { name: 'Sky News', url: 'http://feeds.skynews.com/feeds/rss/home.xml', lean: 'center' },

  // US Sources
  { name: 'Fox News', url: 'https://feeds.foxnews.com/foxnews/latest', lean: 'right' },
  { name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml', lean: 'left' },
  { name: 'Politico', url: 'https://rss.politico.com/politics-news.xml', lean: 'center' },

  // Tech Sources
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', lean: 'center' },
  { name: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index', lean: 'center' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', lean: 'center' },

  // AI Specific
  { name: 'AI News', url: 'https://artificialintelligence-news.com/feed/', lean: 'center' },

  // International News
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', lean: 'center-left' },
  { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/rss/feed/nar', lean: 'center' },
  { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss', lean: 'center' },

  // Economy / Business
  { name: 'The Economist', url: 'https://www.economist.com/latest/rss.xml', lean: 'center' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', lean: 'center' }
];

const KEYWORDS = [
    // Technology & AI
    'tech', 'technology', 'artificial intelligence', 'AI', 'machine learning',
    'chatbot', 'openai', 'grok', 'xai', 'deep learning', 'neural network', 'generative ai',

    // Politics & Government
    'politics', 'election', 'government', 'policy', 'parliament', 'whitehall',
    'prime minister', 'labour party', 'conservative party', 'tory', 'keir starmer', 'rishi sunak',

    // UK Specific
    'UK', 'Britain', 'British', 'Westminster', 'Scotland', 'Wales', 'Northern Ireland',

    // Global Affairs
    'international', 'geopolitics', 'diplomacy', 'war', 'conflict', 'united nations', 'EU', 'NATO',

    // Economy & Finance
    'economy', 'economic', 'inflation', 'interest rate', 'cost of living', 'recession', 'GDP', 'bank of england',

    // Climate & Environment
    'climate', 'climate change', 'global warming', 'carbon', 'sustainability', 'green energy', 'net zero',

    // Security & Defence
    'security', 'cybersecurity', 'national security', 'terrorism', 'military', 'defence', 'intelligence', 'MI5', 'MI6'
];

const MAX_ARTICLE_AGE_HOURS = 48; // Only include articles from the last 48 hours

/**
 * Fetches and filters articles from RSS feeds with improved error handling
 * @returns {Promise<Array>} Array of relevant articles
 */
async function fetchArticles() {
  const allArticles = [];
  const now = new Date();
  const errors = [];
  
  console.log(`Starting to fetch from ${RSS_FEEDS.length} RSS feeds...`);
  
  // Process feeds with individual error handling and rate limiting
  const fetchPromises = RSS_FEEDS.map(feed => 
    limit(async () => {
      try {
        console.log(`Fetching from ${feed.name}...`);
        
        const feedData = await parser.parseURL(feed.url);
        
        if (!feedData.items || feedData.items.length === 0) {
          console.warn(`No items found in feed: ${feed.name}`);
          return [];
        }
        
        const relevantArticles = feedData.items
          .filter(item => {
            // Check if article has required fields
            if (!item.title || !item.link || !item.pubDate) {
              return false;
            }

            // First check if article is within time window
            const articleDate = new Date(item.pubDate);
            if (isNaN(articleDate.getTime())) {
              console.warn(`Invalid date for article: ${item.title}`);
              return false;
            }
            
            const hoursOld = (now - articleDate) / (1000 * 60 * 60);
            if (hoursOld > MAX_ARTICLE_AGE_HOURS) {
              return false;
            }

            // Then check if it matches keywords
            const text = `${item.title} ${item.contentSnippet || item.content || ''}`.toLowerCase();
            return KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
          })
          .slice(0, 5) // Max 5 articles per source
          .map(item => ({
            title: sanitizeHtml(item.title, { 
              allowedTags: [],
              allowedAttributes: {}
            }),
            link: item.link,
            pubDate: item.pubDate,
            content: sanitizeHtml(item.contentSnippet || item.content || '', {
              allowedTags: [], // or ['p', 'br'] if you want to keep some basic formatting
              allowedAttributes: {}
            }),
            source: feed.name,
            lean: feed.lean
          }));
        
        console.log(`Found ${relevantArticles.length} relevant articles from ${feed.name}`);
        return relevantArticles;
        
      } catch (error) {
        const errorMsg = `Error fetching ${feed.name}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        return [];
      }
    })
  );
  
  // Wait for all feeds to complete
  const results = await Promise.allSettled(fetchPromises);
  
  // Collect all successful results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      errors.push(`Feed ${RSS_FEEDS[index].name} failed: ${result.reason}`);
    }
  });
  
  console.log(`Total articles collected: ${allArticles.length}`);
  console.log(`Total errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.warn('Errors encountered:', errors.join('\n'));
  }
  
  if (allArticles.length === 0) {
    throw new Error('No articles could be fetched from any RSS feed. Check network connectivity and feed URLs.');
  }
  
  // Sort by date, most recent first
  return allArticles
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 20); // Top 20 articles
}

/**
 * Generates a summary of articles using AI or fallback method
 * @param {Array} articles - Array of articles to summarize
 * @returns {Promise<string>} Generated summary
 */
async function generateSummary(articles) {
  if (!process.env.XAI_API_KEY) {
    console.log('No XAI API key found, generating simple summary...');
    return generateSimpleSummary(articles);
  }

  try {
    console.log('Generating AI summary...');
    
    const articleTexts = articles.map(article => 
      `**${article.source}** (${article.lean}): ${article.title}\n${article.content.slice(0, 500)}...`
    ).join('\n\n');

    const prompt = `You are an intelligence analyst creating a daily brief. Your task is to analyse these news articles and create a concise, well-structured summary.

Please follow this structure:

## Executive Summary
Provide 1-2 paragraphs summarising the most critical developments.

## Key Trends & Sentiment
- List 2 key emerging trends
- Note 1-2 significant sentiment shifts
- Highlight 1 key future implication

## Key Developments
For each category below, provide a single paragraph summary (50-75 words) focusing on the most important development:

1. Tech & AI Developments
   - Focus on the most significant announcement or breakthrough
   - Note any immediate market impact

2. UK Political News
   - Highlight the most important policy change or announcement
   - Note key party reactions

3. Global Affairs
   - Focus on the most significant international development
   - Note regional implications

4. Economic & Financial Updates
   - Highlight the most important market movement
   - Note policy impacts

5. Climate & Environment
   - Focus on the most significant environmental development
   - Note policy changes

For each category:
- Focus on the single most significant development
- Rate its significance (High/Medium/Low)
- Keep to 50-75 words maximum

## Key Takeaways
- List 3 most important implications
- Note 1-2 developments to watch

Articles to analyse:
${articleTexts}

Create a concise brief that's informative and well-structured. Total length should be 500-600 words, with each category summary being 50-75 words maximum (no need to show the word count). Focus on actionable insights.`;

const response = await axios.post('https://api.x.ai/v1/chat/completions', {
  model: 'grok-3-mini',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 2200,
  temperature: 0.7,
  stream: false
}, {
  headers: {
    'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000,
  httpAgent: httpAgent,
  httpsAgent: httpsAgent
});

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid response format from XAI API');
    }

    const summary = response.data.choices[0].message.content;
    console.log('AI summary generated successfully');
    return summary;
  } catch (error) {
    console.error('Error with AI summary:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
    }
    console.log('Falling back to simple summary...');
    return generateSimpleSummary(articles);
  }
}

function generateSimpleSummary(articles) {
  console.log('Generating simple fallback summary...');
  
  const categories = {
    tech: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('tech') || text.includes('ai') || text.includes('artificial intelligence') ||
             text.includes('machine learning') || text.includes('chatbot') || text.includes('openai') ||
             text.includes('grok') || text.includes('xai') || text.includes('deep learning') ||
             text.includes('neural network') || text.includes('generative ai');
    }),
    politics: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('politic') || text.includes('election') || text.includes('government') ||
             text.includes('policy') || text.includes('parliament') || text.includes('whitehall') ||
             text.includes('prime minister') || text.includes('labour party') || text.includes('conservative party') ||
             text.includes('tory') || text.includes('keir starmer') || text.includes('rishi sunak');
    }),
    uk: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('uk') || text.includes('britain') || text.includes('british') ||
             text.includes('westminster') || text.includes('scotland') || text.includes('wales') ||
             text.includes('northern ireland');
    }),
    global: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('international') || text.includes('geopolitics') || text.includes('diplomacy') ||
             text.includes('war') || text.includes('conflict') || text.includes('united nations') ||
             text.includes('eu') || text.includes('nato');
    }),
    economy: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('economy') || text.includes('economic') || text.includes('inflation') ||
             text.includes('interest rate') || text.includes('cost of living') || text.includes('recession') ||
             text.includes('gdp') || text.includes('bank of england');
    }),
    climate: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('climate') || text.includes('climate change') || text.includes('global warming') ||
             text.includes('carbon') || text.includes('sustainability') || text.includes('green energy') ||
             text.includes('net zero');
    }),
    security: articles.filter(a => {
      const text = a.title.toLowerCase();
      return text.includes('security') || text.includes('cybersecurity') || text.includes('national security') ||
             text.includes('terrorism') || text.includes('military') || text.includes('defence') ||
             text.includes('intelligence') || text.includes('mi5') || text.includes('mi6');
    })
  };

  let summary = '## Daily News Brief\n\n';
  summary += `Generated on ${format(new Date(), 'EEEE, MMMM do, yyyy')} at ${format(new Date(), 'HH:mm')} UTC\n\n`;
  summary += `**Total Articles Analysed**: ${articles.length}\n\n`;
  
  Object.entries(categories).forEach(([category, categoryArticles]) => {
    if (categoryArticles.length > 0) {
      summary += `### ${category.toUpperCase()} (${categoryArticles.length} articles)\n`;
      categoryArticles.slice(0, 3).forEach(article => {
        summary += `- **${article.source}**: [${article.title}](${article.link})\n`;
        summary += `  *${new Date(article.pubDate).toLocaleDateString('en-GB')}*\n`;
      });
      summary += '\n';
    }
  });

  return summary;
}

async function generateHugoMarkdown(summary, articles) {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const readableDate = format(today, 'EEEE, MMMM do, yyyy');
  
  // Clean summary for markdown (remove HTML if AI returns any)
  const cleanSummary = summary
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\*\*(.*?)\*\*/g, '**$1**'); // Keep markdown bold
  
  const frontMatter = `---
title: "Daily Brief - ${readableDate}"
date: ${today.toISOString()}
draft: false
type: "brief"
summary: "Daily intelligence brief covering tech, AI, politics, UK and world news"
tags: ["news", "daily-brief", "tech", "politics", "ai"]
showReadingTime: false
showToc: false
---

${cleanSummary}

## Source Articles

${articles.map(article => `
### ${article.source} ${getBadge(article.lean)}
**[${article.title}](${article.link})**  
*${new Date(article.pubDate).toLocaleDateString('en-GB')}*

${article.content ? article.content.slice(0, 150) + '...' : ''}
`).join('\n')}

---

**Source Balance**: This brief includes perspectives from left-leaning, center/neutral, and right-leaning sources to provide balanced coverage.

**Sources**: ${[...new Set(articles.map(a => a.source))].join(', ')}

**Generated**: ${today.toISOString()}
`;

  return frontMatter;
}

function getBadge(lean) {
  const badges = {
    'left': '🔵',
    'center': '⚪',
    'right': '🔴'
  };
  return badges[lean] || '⚪';
}

function deduplicateArticles(articles) {
  const uniqueArticles = [];
  const seenTitles = new Set();

  articles.forEach(article => {
    // Normalize the title for comparison
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .trim();

    // Check if this is a duplicate
    const isDuplicate = Array.from(seenTitles).some(existingTitle => {
      // Check if either title contains the other
      return normalizedTitle.includes(existingTitle) || 
             existingTitle.includes(normalizedTitle) ||
             // Add Levenshtein distance check for similar titles
             levenshteinDistance(normalizedTitle, existingTitle) < 10;
    });

    if (!isDuplicate) {
      seenTitles.add(normalizedTitle);
      uniqueArticles.push(article);
    }
  });

  return uniqueArticles;
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

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

async function main() {
  try {
    console.log('Starting daily brief generation...');
    console.log('Environment check:');
    console.log('- Node.js version:', process.version);
    console.log('- Working directory:', process.cwd());
    console.log('- XAI API key present:', !!process.env.XAI_API_KEY);
    console.log('- Date/time:', new Date().toISOString());
    
    const articles = await fetchArticles();
    console.log(`✅ Found ${articles.length} relevant articles`);
    
    const sourceCounts = {};
    articles.forEach(article => {
      sourceCounts[article.source] = (sourceCounts[article.source] || 0) + 1;
    });
    console.log('📊 Articles by source:', sourceCounts);
    
    const uniqueArticles = deduplicateArticles(articles);
    console.log(`✅ Deduplicated to ${uniqueArticles.length} unique articles`);
    
    const summary = await generateSummary(uniqueArticles);
    console.log('✅ Summary generated successfully');
    
    const markdown = await generateHugoMarkdown(summary, uniqueArticles);
    console.log('✅ Markdown generated successfully');
    
    // Create content/briefs directory if it doesn't exist
    const briefsDir = path.join(process.cwd(), 'content', 'briefs');
    try {
      await fs.access(briefsDir);
      console.log('📁 Briefs directory exists');
    } catch {
      await fs.mkdir(briefsDir, { recursive: true });
      console.log('📁 Created briefs directory');
    }
    
    // Save today's brief as Hugo markdown
    const today = format(new Date(), 'yyyy-MM-dd');
    const filename = `${today}.md`;
    const filePath = path.join(briefsDir, filename);
    
    await fs.writeFile(filePath, markdown);
    console.log(`✅ Brief saved as ${filename}`);
    
    // Verify file was written
    const stats = await fs.stat(filePath);
    console.log(`📄 File size: ${stats.size} bytes`);
    
    // Create briefs section index page
    await createBriefsSection();
    console.log('✅ Briefs section index created');
    
    console.log(`🎉 Brief generation completed successfully: ${filename}`);
    
    // Final verification
    const finalCheck = await fs.readFile(filePath, 'utf8');
    console.log(`📝 Final file preview (first 200 chars):`);
    console.log(finalCheck.substring(0, 200) + '...');

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error generating brief:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

async function createBriefsSection() {
  const briefsIndexContent = `---
title: "Daily News Briefs"
date: ${new Date().toISOString()}
draft: false
summary: "Daily intelligence briefs covering tech, AI, politics, UK and world news"
---

# Daily Intelligence Briefs

## How This Brief Is Made

Each morning, an automated script scans a curated selection of over 15 trusted RSS news feeds from across the political and geographic spectrum — including sources like BBC, The Guardian, Fox News, Al Jazeera, The Economist, and more. These feeds are filtered for relevance using a custom set of keywords spanning tech, politics, the economy, global affairs, climate, and security.

Articles published within the last 48 hours are extracted, de-duplicated, and sorted by recency. A maximum of 20 of the most relevant stories are selected.

If an AI key is available, these stories are passed to a language model (currently Grok-3 Mini) along with a structured prompt that generates a concise and readable intelligence-style brief. If no AI is available, a fallback system categorises and lists articles in markdown format under key topics.

The end result is a balanced, daily digest — summarising essential developments across technology, politics, finance, and more — ready to be published as a markdown file to the site using GitHub Actions.

*Last updated: ${new Date().toISOString()}*
`;

  const briefsDir = path.join(process.cwd(), 'content', 'briefs');
  await fs.writeFile(path.join(briefsDir, '_index.md'), briefsIndexContent);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();