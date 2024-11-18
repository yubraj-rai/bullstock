import { Server } from 'socket.io';
import { Stock } from '../models/Stock';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const finnhub = require('finnhub');

// Setup the Finnhub client
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

const refreshIntervalIds = {};

// Configurable update interval (in milliseconds)
const DEFAULT_INTERVAL = 90000; // Update every 90 seconds
const MAX_API_CALLS_PER_MINUTE = 60; // Finnhub API rate limit for free accounts
const MIN_UPDATE_INTERVAL = 60000; // Minimum interval between updates for each ticker (60 seconds)
const COOLDOWN_PERIOD = 3600000; // Cooldown period after all tickers are updated (120 seconds)

// List of stock tickers to monitor
const stockTickers = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "BRK.B", "JPM", "V", "WMT",
    "JNJ", "PG", "MA", "UNH", "HD", "NVDA", "DIS", "BAC", "XOM", "COST",
    "KO", "PEP", "CSCO", "ADBE", "NFLX", "MCD", "INTC", "CRM", "VZ", "T",
    "IBM", "ORCL", "NKE", "AMD", "GE", "BA", "CAT", "MMM", "UPS", "FDX",
    "SBUX", "GM", "F"
];

// Track the last update time for each ticker
const lastUpdateTimes = {};

// Track the number of API calls made in the current minute
let apiCallCount = 0;

// Timestamp of the last API call
let lastApiCallTime = Date.now();

export const updateStockPrices = async (interval = DEFAULT_INTERVAL, io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    // Start updating stock prices if not already running
    if (!refreshIntervalIds['stockUpdater']) {
        console.log(`Started updating stocks ${io ? 'with' : 'without'} socket emits every ${interval / 1000} seconds`);

        refreshIntervalIds['stockUpdater'] = setInterval(async () => {
            try {
                const updatedStocks = [];
                const batchSize = Math.min(stockTickers.length, MAX_API_CALLS_PER_MINUTE);

                // Process stock data in batches to respect the API rate limit
                for (let i = 0; i < stockTickers.length; i += batchSize) {
                    const batchTickers = stockTickers.slice(i, i + batchSize);

                    // Check if the rate limit has been reached
                    if (apiCallCount >= MAX_API_CALLS_PER_MINUTE) {
                        const timeSinceLastCall = Date.now() - lastApiCallTime;
                        const waitTime = 60000 - timeSinceLastCall; // Time to wait in milliseconds
                        //console.log(`API rate limit reached. Waiting for ${waitTime / 1000} seconds.`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        apiCallCount = 0; // Reset the API call count
                    }

                    await Promise.all(batchTickers.map(ticker => {
                        return new Promise<void>((resolve, reject) => {
                            // Check if the ticker needs to be updated
                            const now = Date.now();
                            const lastUpdateTime = lastUpdateTimes[ticker] || 0;
                            if (now - lastUpdateTime >= MIN_UPDATE_INTERVAL) {
                                finnhubClient.quote(ticker, async (error, data) => {
                                    if (error) {
                                        //console.error(`Error fetching price for ${ticker}:`, error);
                                        return reject(error);
                                    }

                                    if (data && data.c !== undefined) {
                                        const price = parseFloat(data.c.toFixed(2));

                                        try {
                                            // Update the database with the new price
                                            await Stock.findOneAndUpdate(
                                                { ticker },
                                                { price }
                                            );
                                            //console.log(`Database updated for ${ticker} with price: ${price}`);
                                            updatedStocks.push({ ticker, price });

                                            // Emit to Socket.io with a slight delay
                                            const sendDelay = Math.random() * (5000 - 1500) + 1500;
                                            socketEmit(io, sendDelay, ticker, { price });

                                            // Update the last update time for the ticker
                                            lastUpdateTimes[ticker] = now;
                                        } catch (dbError) {
                                            //console.error(`Error updating database for ${ticker}:`, dbError);
                                        }

                                        resolve();
                                    } else {
                                        //console.warn(`No data received for ${ticker}`);
                                        resolve();
                                    }
                                });
                            } else {
                                resolve(); // Skip updating this ticker
                            }
                        });
                    }));

                    // Update the API call count and timestamp
                    apiCallCount += batchTickers.length;
                    lastApiCallTime = Date.now();

                    // Wait for one second after each batch to comply with rate limits
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                //console.log(`Finished updating ${updatedStocks.length} stocks.`);

                // Check if all tickers have been updated
                if (Object.keys(lastUpdateTimes).length === stockTickers.length) {
                    //console.log(`All tickers updated. Waiting for ${COOLDOWN_PERIOD / 1000} seconds before next update.`);
                    await new Promise(resolve => setTimeout(resolve, COOLDOWN_PERIOD));
                    // Reset the last update times
                    Object.keys(lastUpdateTimes).forEach(ticker => {
                        lastUpdateTimes[ticker] = 0;
                    });
                }
            } catch (error) {
                //console.error("Error processing stock data:", error);
            }
        }, interval);
    }
};

export const stopUpdatingStockPrices = () => {
    clearInterval(refreshIntervalIds['stockUpdater']);
    refreshIntervalIds['stockUpdater'] = null;
    console.log('Stopped updating stock prices.');
};

const socketEmit = (io, sendDelay, to, value) => {
    setTimeout(() => {
        io?.emit(to, value);
    }, sendDelay);
};
