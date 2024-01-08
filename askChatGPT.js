//import { CHAT_GPT_API_KEY } from "./config.js";
import axios from 'axios';

const apiKey = process.env.CHAT_GPT_API_KEY;

async function askChatGPT(articleContent) {
    const prompt = `Predict the stock's price direction in the short term and long term based on the company or news detail mentioned in the article. Provide a brief reason what lead to conclude each prediction first (1 or 2 sentences, very short). ` +
                   `Article content: ${articleContent}. \nShort Term: [output]. \nLong Term: [output].`;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        return response.data.choices[0].text.trim(); // Return the response text
    } catch (error) {
        console.error('Error in making API call:', error);
        return null; // Return null in case of an error
    }
}

//export default askChatGPT;
// Example usage
const content = "1. The “rich” valuations are entirely justified:  The most common knock on the Magnificent Seven is that they are “overvalued.” On the surface, this argument seems valid. These stocks’ p/e ratios appear high. Recently their average forward p/e was close to 35, more than twice the long-term average p/e of 16.5 for the S&P 500  SPX  ,  and a p/e of 15.6 for this index if you take out the Magnificent 7.\nBut what if those elevated p/e ratios are justified? That’s actually the case, says Tim Murray, the capital markets strategist at T. Rowe Price. “The outlier valuations that these stocks carry is absolutely matched by the fundamentals,” says Murray, who is otherwise cautious on the stock market in part because of what he believes is the potential for a U.S. recession.\nHere’s Murray’s logic on the Magnificent Seven. The starting point is that Murray thinks return on equity (ROE) is a good one-size-fits-all metric for capturing the fundamental strength at companies. ROE is defined as net income divided by total equity. It is a basic measure of how well managers are running a company. “The Magnificent Seven have outlier valuations, but the ROE, the fundamentals, are every bit as much of an outlier,” he says.\nHe puts the average ROE for the Magnificent Seven at 33%. That’s twice the ROE for the U.S. stock market, which is 16.47%, according to NYU Stern School of Business finance professor Aswath Damodaran. While ROEs vary by sector, in general an ROE of 15% to 20% is considered go";
console.log(askChatGPT(content));
