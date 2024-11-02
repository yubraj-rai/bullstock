// utils/fetchAndStoreNews.ts
import fetch from 'node-fetch';
import { MarketNews } from '../models/MarketNews';

const NEWS_EXPIRY_MINUTES = 360; // Defines how recent the news data should be

export async function fetchAndStoreNews() {
    try {
        // Check if recent news is already in the database
        const recentNews = await MarketNews.findOne().sort({ publishedAt: -1 });

        if (recentNews) {
            const now = new Date();
            const timeDiff = (now.getTime() - recentNews.createdAt.getTime()) / (1000 * 60); // minutes
            if (timeDiff < NEWS_EXPIRY_MINUTES) {
                return await MarketNews.find().sort({ publishedAt: -1 }); // Return existing news if recent
            }
        }

        // Fetch new news data if none found or if outdated
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
        );

        if (!response.ok) throw new Error(`Failed to fetch news: ${response.statusText}`);

        const data = await response.json();

        // Clear old news and insert new data
        await MarketNews.deleteMany({});
        const newsDocs = data.map((newsItem: any) => ({
            title: newsItem.headline,
            description: newsItem.summary,
            url: newsItem.url,
            imageUrl: newsItem.image,
            publishedAt: new Date(newsItem.datetime * 1000),
        }));
        await MarketNews.insertMany(newsDocs);

        console.log('News data successfully updated in MongoDB');
        return newsDocs;
    } catch (error) {
        console.error('Error fetching or storing news:', error);
        return [];
    }
}
