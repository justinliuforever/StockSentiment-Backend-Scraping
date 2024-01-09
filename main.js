import axios from 'axios';
import dotenv from 'dotenv';
import fetchAndProcessNewsData from './addNewsArticles.js';
import getStockNewsData from './getStockNewsData.js';
import scrapeNewsPolygon from './scrapingNewsPolygon.js';
import { tickers } from './constants.js';
dotenv.config();

// Define BASE_URL
const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5555';
console.log('start...');
console.log('BASE_URL:', BASE_URL);

const limit = 5;

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

const today = formatDate(new Date());
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

// Function to compare and update new data
async function compareAndUpdate(news, ticker) {
  console.log('Comparing and updating for ticker:', ticker);
  try {
    const mongoData = await getStockNewsData(ticker, "2023-11-01", tomorrow);
    //console.log('MongoDB data:', mongoData);
    const newArticles = news.filter(article =>
      !mongoData.some(mongoArticle => mongoArticle.title === article.title)
    );
    console.log('New articles:', newArticles);
    newArticles.forEach(postNewStockInfo);
  } catch (error) {
    console.error('Error in compareAndUpdate:', error);
  }
}

// Function to run periodically for each ticker
async function periodicTask() {
  for (const ticker of tickers) {
    try {
      const news = await scrapeNewsPolygon(ticker, limit);
      if (news) {
        console.log(`News for ${ticker}:`);
        // news.forEach(article => {
        //   console.log(JSON.stringify(article, null, 2));
        // });
        await compareAndUpdate(news, ticker);
      }
    } catch (error) {
      console.error(`Error in periodicTask for ${ticker}:`, error);
    }
  }
}

// Schedule the task to run
// 1 minute = 60000 milliseconds

setInterval(periodicTask, 70000 * 60 * 3);

// This is for scraping Content and askChatGPT, and then updating the database
setInterval(fetchAndProcessNewsData, 60000 * 60 * 3);

// Run the task immediately on startup
periodicTask();
