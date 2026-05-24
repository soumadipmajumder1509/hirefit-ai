const axios = require('axios');
const cheerio = require('cheerio');

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
};

// Ordered from most-specific to most-general
const JOB_DESCRIPTION_SELECTORS = [
  // Greenhouse
  '#content',
  '.job__description',
  // Lever
  '.posting-page',
  '.content',
  // Workday
  '[data-automation-id="jobPostingDescription"]',
  // Indeed
  '#jobDescriptionText',
  '.jobsearch-jobDescriptionText',
  // LinkedIn (public)
  '.description__text',
  '.show-more-less-html__markup',
  // Glassdoor
  '.jobDescriptionContent',
  '[data-test="jobDescriptionContent"]',
  // Generic
  '#job-description',
  '.job-description',
  '[class*="job-description"]',
  '[class*="jobDescription"]',
  '[id*="job-description"]',
  'article',
  'main',
  '.description',
  '#description',
];

async function scrapeJobDescription(url) {
  let html;
  try {
    const response = await axios.get(url, {
      headers: BROWSER_HEADERS,
      timeout: 15000,
      maxRedirects: 5,
    });
    html = response.data;
  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      throw new Error(
        'This job site requires authentication. Please copy the job description text manually.'
      );
    }
    throw new Error(`Failed to fetch URL: ${err.message}`);
  }

  const $ = cheerio.load(html);

  // Remove noise
  $('script, style, nav, header, footer, iframe, .cookie-banner, [class*="cookie"]').remove();

  // Try each selector in order
  for (const selector of JOB_DESCRIPTION_SELECTORS) {
    const el = $(selector);
    if (el.length > 0) {
      const text = el.text().replace(/\s+/g, ' ').trim();
      if (text.length > 200) {
        return { text, source: selector };
      }
    }
  }

  // Final fallback: grab all body text
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  if (bodyText.length > 200) {
    return { text: bodyText.slice(0, 8000), source: 'body' };
  }

  throw new Error(
    'Could not extract job description from this page. Please paste the text manually.'
  );
}

module.exports = { scrapeJobDescription };
