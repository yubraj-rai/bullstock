import fetch from 'node-fetch';
import { MarketNews } from '../models/MarketNews';
import Redis from 'ioredis'; // or use 'redis' depending on your preference

const NEWS_EXPIRY_MINUTES = 10; // Set to 10 minutes to match the API call delay

// Set up Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export async function fetchAndStoreNews(limit, offset) {
    try {
        // Check if recent news is cached in Redis
        const cachedNews = await redis.get('marketNews');
        
        if (cachedNews) {
            // If cached news exists, parse it and check its expiration time
            const newsData = JSON.parse(cachedNews);
            const now = new Date();
            const timeDiff = (now.getTime() - new Date(newsData[0].createdAt).getTime()) / (1000 * 60); // minutes
            
            if (timeDiff < NEWS_EXPIRY_MINUTES) {
                console.log('Returning existing news from the database.');
                return await MarketNews.find().sort({ publishedAt: -1 }).limit(limit).skip(offset);
            }
        }

        console.log('Fetching new data from the API.');

        // Fetch new news data if not found in cache or cache is outdated
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.error('No data received from the API.');
            return [];
        }

        // Clear old news in MongoDB only if new data is successfully fetched
        await MarketNews.deleteMany({});
        const newsDocs = data.map((newsItem: any) => ({
            title: newsItem.headline,
            description: newsItem.summary,
            url: newsItem.url,
            imageUrl: newsItem.image,
            publishedAt: new Date(newsItem.datetime * 1000),
            createdAt: new Date(), // This is the date the document was inserted
        }));

        // Insert new data into MongoDB
        await MarketNews.insertMany(newsDocs);
        console.log('News data successfully updated in MongoDB');

        // Cache the news data in Redis for future requests
        await redis.set('marketNews', JSON.stringify(newsDocs), 'EX', NEWS_EXPIRY_MINUTES * 60); // Expiry time in seconds

        return newsDocs;
    } catch (error) {
        console.error('Error fetching or storing news:', error);
        return [];
    }
}
