import axios from 'axios';
//import { POLYGON_API_KEY } from './config.js';
import dotenv from 'dotenv';
dotenv.config();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

async function scrapeNewsPolygon(ticker, limit) {
    const url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=${limit}&apiKey=${POLYGON_API_KEY}`;
    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const newsData = response.data;
            const articlesInfo = [];

            newsData.results.forEach(article => {
                const publisherInfo = article.publisher || {};
                //console.log('Article:', article);
                const articleDetails = {
                    ticker,
                    name: publisherInfo.name || 'empty',
                    homePageURL: publisherInfo.homepage_url || 'empty',
                    logoURL: publisherInfo.logo_url || 'empty',
                    title: article.title || 'empty',
                    articleURL: article.article_url || 'empty',
                    imageURL: article.image_url || 'empty',
                    author: article.author || 'empty',
                    description: article.description || 'empty',
                    content: "empty",
                    chatGPTAnalysis: {
                        shortTermPrediction: 'empty',
                        longTermPrediction: 'empty',
                    },
                    publishedUTC: article.published_utc || 'empty',
                    publisher: publisherInfo.name || 'empty'
                };
                articlesInfo.push(articleDetails);
            });

            return articlesInfo;
        } else {
            console.log(`Error: Unable to fetch data (Status code: ${response.status})`);
            return null;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

export default scrapeNewsPolygon;
