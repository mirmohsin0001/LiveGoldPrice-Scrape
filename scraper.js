// scraper-puppeteer.js
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

async function scrapeIBJARates() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://ibjarates.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for rates to load
    await page.waitForSelector('.rates-tbl', { timeout: 10000 });
    
    // Extract data
    const rates = await page.evaluate(() => {
      // Adjust selectors based on actual website structure
      return {
        gold_999_am: document.querySelector('#lblGold999_AM')?.innerText,
        gold_999_pm: document.querySelector('#lblGold999_PM')?.innerText,

        gold_995_am: document.querySelector('#lblGold995_AM')?.innerText,
        gold_995_pm: document.querySelector('#lblGold995_PM')?.innerText,

        gold_916_am: document.querySelector('#lblGold916_AM')?.innerText,
        gold_916_pm: document.querySelector('#lblGold916_PM')?.innerText,

        gold_750_am: document.querySelector('#lblGold750_AM')?.innerText,
        gold_750_pm: document.querySelector('#lblGold750_PM')?.innerText,

        gold_585_am: document.querySelector('#lblGold585_AM')?.innerText,
        gold_585_pm: document.querySelector('#lblGold585_PM')?.innerText,

        timestamp: new Date().toISOString()
      };
    });
    
    await browser.close();
    console.log('Gold rates fetched successfully!');
    return rates;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

app.get('/api/gold-rates', async (req, res) => {
  console.log('Fetching gold rates...');
  try {
    const rates = await scrapeIBJARates();
    res.json(rates);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
