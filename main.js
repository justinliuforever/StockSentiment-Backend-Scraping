import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import fetchAndProcessNewsData from './addNewsArticles.js';
import getStockNewsData from './getStockNewsData.js';
import scrapeNewsPolygon from './scrapingNewsPolygon.js';
import { tickers } from './constants.js';

dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000; // Use Render's PORT environment variable

// Define BASE_URL
const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5555';
console.log('start...');
console.log('BASE_URL:', BASE_URL);

const limit = 5;

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

const today = formatDate(new Date());
const yesterday = formatDate(new Date(new Date().getTime() - 5*(24 * 60 * 60 * 1000)));
const tomorrow = formatDate(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)));

async function postNewStockInfo(article) {
  console.log('Posting new stock info...');
  try {
    const response = await axios.post(`${BASE_URL}/stockAnalysis`, article);
    console.log('Posted new stock info:', response.data);
  } catch (error) {
    console.error('Error posting to MongoDB:', error);
  }
}

async function compareAndUpdate(news, ticker) {
  console.log('Comparing and updating for ticker:', ticker);
  try {
    const mongoData = await getStockNewsData(ticker, yesterday, tomorrow);
    const newArticles = news.filter(article =>
      !mongoData.some(mongoArticle => mongoArticle.title === article.title)
    );
    //console.log('New articles:', newArticles);
    console.log('New articles:', newArticles.length);
    
    newArticles.forEach(postNewStockInfo);
  } catch (error) {
    console.error('Error in compareAndUpdate:', error);
  }
}

async function periodicTask() {
  for (const ticker of tickers) {
    try {
      const news = await scrapeNewsPolygon(ticker, limit);
      if (news) {
        console.log(`News for ${ticker}:`);
        await compareAndUpdate(news, ticker);
      }
    } catch (error) {
      console.error(`Error in periodicTask for ${ticker}:`, error);
    }
  }
}

// app.get('/', (req, res) => {
//   res.json({ message: 'Stock Analysis Scraper Running', status: 'active' });
// });

// // Start the HTTP server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   // Run your periodic tasks here to ensure they start after the server is up
//   setInterval(periodicTask, 70000 * 60 * 3);
//   setInterval(fetchAndProcessNewsData, 60000 * 60 * 3);
//   periodicTask(); // Run the task immediately on startup
// });



periodicTask(); // Run the task immediately on startup
setTimeout(fetchAndProcessNewsData, 60000 * 5); // Schedule fetchAndProcessNewsData to run after 5 minutes
