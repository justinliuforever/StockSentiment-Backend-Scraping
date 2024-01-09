npm install axios

npm i mongoose

npm install puppeteer

npm install openai@^4.0.0

npm install dotenv

using the database from "https://stocksentiment-backend.onrender.com"

### Scrapying

npm install axios

In this schema:

- `title`: Stores the title of the stock analysis.
- `articleUrl`: Stores the URL of the article.
- `author`: Stores the name of the author.
- `description`: Stores a short description of the article.
- `content`: Stores content of the article.
- `publishedUTC`: Stores the publication date and time in UTC. It is defined as a Date type to facilitate date-related queries and operations.
- `publisher`: Stores the name of the publisher.

The `timestamps: true` option in the schema definition will automatically add `createdAt` and `updatedAt` fields to your documents, which can be very useful for tracking when a record was created or last modified.

### addNewsArticles() Function

获得 MongoDB 端的 Stock Data, 然后过滤一下 newsCompanyName(因为有些 web 用 RapidAPI 爬不了). -> 用 RapidAPI 访问每个 Stock Data 中的 url, 获得 article 的 content 部分(间隔 4seconds). -> 最后把 content 部分 put 到 MongoDB 上.

Website:

Rapid API (Scarping the news content) :"https://rapidapi.com/developer/dashboard", "https://rapidapi.com/lexper/api/article-data-extraction-and-text-mining" 这里使用的是 ujeebu api, 是一个 data extraction 的 api, combine with the power of machine learning, 能够更加智能的 extract the content from a news webapge.

Polygon.io (Geting the news comprehensive inform) API :"https://polygon.io/dashboard/"

ChatGPT (News Analysis): "https://platform.openai.com/usage"

MongoDB (Backend database) :"https://cloud.mongodb.com/"
