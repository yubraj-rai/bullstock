import { Server } from 'socket.io';
import { Stock } from '../models/Stock';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const finnhub = require('finnhub');

// Setup the Finnhub client
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY; // Ensure you have set your API key
const finnhubClient = new finnhub.DefaultApi();

const refreshIntervalIds = {};
let isRateLimited = false;
let rateLimitResetTime = 0;

// The list of stock tickers you want to monitor
const stockTickers = [
    "AMC", "ADBE", "AMD", "BFH", "AMZN", "AAPL", "BAC", "BNS.TO", "BRK.A", "BB.TO", "BA",
    "COST", "DELL", "FB", "FDX", "F", "GME", "GOOGL", "HD", "INTC", "IBM", "LYFT", "MTCH",
    "MCD", "MSFT", "NVDA", "NFLX", "NKE", "PYPL", "HOOD", "RY.TO", "SHOP", "SPOT", "TSLA",
    "TD.TO", "UBER", "UPS", "VZ", "V", "WMT", "DIS"
];

export const updateStockPrices = async (id: number, interval: number, io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    if (!refreshIntervalIds[id]) {
        console.log(`Started updating all stocks from Finnhub API ${io ? 'with' : 'without'} socket emits every ${interval / 1000} seconds`);

        // Set up the interval to update stock prices
        refreshIntervalIds[id] = setInterval(async () => {
            if (isRateLimited) {
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                if (currentTime >= rateLimitResetTime) {
                    isRateLimited = false; // Reset rate limit flag
                } else {
                    console.log(`Rate limit reached. Waiting until ${new Date(rateLimitResetTime * 1000).toLocaleString()} to retry.`);
                    return; // Exit early if rate-limited
                }
            }

            try {
                const updatedStocks = [];

                // Fetching stock data in batches of 10 stocks
                for (let i = 0; i < stockTickers.length; i += 10) {
                    const batchTickers = stockTickers.slice(i, i + 10);

                    await Promise.all(batchTickers.map(ticker => {
                        return new Promise<void>((resolve, reject) => {
                            finnhubClient.quote(ticker, async (error, data, response) => {
                                if (error) {
                                    console.error(`Error fetching price for ${ticker}:`, error);
                                    if (error.response?.status === 429) {
                                        isRateLimited = true;
                                        rateLimitResetTime = error.response.headers['x-ratelimit-reset'];
                                    }
                                    return reject(error);
                                }

                                if (data && data.c !== undefined) {
                                    const price = data.c; 

                                    try {
                                        // Update the database with the new price
                                        await Stock.findOneAndUpdate(
                                            { ticker },
                                            { price: parseFloat(price.toFixed(2)) }
                                        );
                                        console.log(`Database updated successfully for ${ticker}`);
                                    } catch (dbError) {
                                        console.error(`Error updating database for ${ticker}:`, dbError);
                                    }

                                    updatedStocks.push({ ticker, price: parseFloat(price.toFixed(2)) });

                                    const sendDelay = Math.random() * (5000 - 1500) + 1500;
                                    socketEmit(io, sendDelay, ticker, {
                                        price: parseFloat(price.toFixed(2)),
                                    });

                                    console.log(`Updated ${ticker} to price: ${price}`);
                                    resolve(); 
                                } else {
                                    console.warn(`No data received for ${ticker}`);
                                    resolve();
                                }
                            });
                        });
                    }));
                }

                console.log(`Finished updating ${updatedStocks.length} stocks`);
            } catch (error) {
                console.error("Error processing stock data:", error);
            }
        }, interval);
    }
};

export const stopUpdatingStockPrices = (id: number) => {
    clearInterval(refreshIntervalIds[id]);
    refreshIntervalIds[id] = null;
};

const socketEmit = (io, sendDelay, to, value) => {
    setTimeout(() => {
        io?.emit(to, value);
    }, sendDelay);
};
