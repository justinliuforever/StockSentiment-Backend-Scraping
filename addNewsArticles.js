import { delayTime, newsCompanyName, tickers } from './constants.js';

//import { RAPIDAPI_KEY } from './config.js';
import { addGPTAnalysis } from './addGPTAnalysis.js';
import axios from 'axios';
import dotenv from 'dotenv';
import getStockNewsData from './getStockNewsData.js';

dotenv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// BASE_URL is set to the Render service URL in production and defaults to localhost for local development.
const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5555';

async function fetchAndProcessNewsData() {
    for (const ticker of tickers) {
        const newsData = await getStockNewsData(ticker, "2023-11-01", "2024-11-01");

        for (const article of newsData) {
            if (newsCompanyName.includes(article.name) && article.content === "empty") {
                console.log("*************************************");
                console.log(article.title);
                const extractionResult = await extractArticleText(article.articleURL);

                if (extractionResult.success) {
                    await updateStockAnalysis(article._id, extractionResult.text);
                    await delay(delayTime);
                } else {
                    console.log(`Failed to extract text for URL ${article.articleURL}: ${extractionResult.error}`);
                    // Handle the error case, perhaps retry or log the failure for later review
                }
            }
        }
    }
}

async function extractArticleText(url) {
    const options = {
        method: 'GET',
        url: 'https://lexper.p.rapidapi.com/v1.1/extract',
        params: { url: url, js_timeout: '30', media: 'true' },
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'lexper.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return { text: response.data.article.text, success: true };
    } catch (error) {
        console.error('Error fetching article text:', error);
        return { error: error.message, success: false };
    }
}

async function updateStockAnalysis(id, content) {
    try {
        await delay(delayTime);

        const chatGPTPredictions = await addGPTAnalysis(content);
        if (chatGPTPredictions) {
            const shortTermRegex = /Short Term:\s*(.*?)\s*(?=\n|$)/;
            const longTermRegex = /Long Term:\s*(.*?)\s*(?=\n|$)/;

            const shortTermMatch = chatGPTPredictions.match(shortTermRegex);
            const longTermMatch = chatGPTPredictions.match(longTermRegex);

            const shortTermPrediction = shortTermMatch ? shortTermMatch[1] : '';
            const longTermPrediction = longTermMatch ? longTermMatch[1] : '';

            if (shortTermPrediction && longTermPrediction) {
                const response = await axios.put(`${BASE_URL}/stockAnalysis/${id}`, {
                    content: content,
                    chatGPTAnalysis: {
                        shortTermPrediction: shortTermPrediction,
                        longTermPrediction: longTermPrediction
                    }
                });
                console.log('Stock analysis updated:', response.data);
            } else {
                console.log('Failed to extract predictions properly');
            }
        } else {
            console.log('No predictions received from ChatGPT');
        }
    } catch (error) {
        console.error('Error updating stock analysis:', error);
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Uncomment the line below to run the function when you're ready
//fetchAndProcessNewsData();

export default fetchAndProcessNewsData;
