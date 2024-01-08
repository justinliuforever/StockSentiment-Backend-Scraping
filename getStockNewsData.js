import axios from 'axios';
import { delayTime } from './constants.js';

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Use an environment variable for the base URL, defaulting to 'http://localhost:5555'
const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5555';

async function getStockNewsData(ticker, beginDate, endDate) {
    // Use the BASE_URL variable to construct the full endpoint URL
    const url = `${BASE_URL}/stockAnalysis/ticker/${ticker}?minDate=${beginDate}&maxDate=${endDate}`;
    try {
        await delay(delayTime);
        const response = await axios.get(url);
        const data = response.data.data; // Assuming the structure is as you described
        return data; // This will be an array of objects as per your server's response
    } catch (error) {
        console.error('Error fetching stock news data:', error);
        return []; // Return an empty array in case of an error
    }
}

export default getStockNewsData;
