import { stockUpdatesVar, updateStockPrice } from './cacheConfig';
import { PersistentStorage } from './persistentStorage';

interface StorageConfig {
  prefix: string;
  version: string;
  storageType: 'localStorage' | 'sessionStorage';
}

interface PriceData {
  price: number;
  timestamp: number;
}

export class StockPriceCache {
  private static instance: StockPriceCache;
  private priceUpdateCallbacks: Map<string, Set<(price: number) => void>>;
  private storage: PersistentStorage;
  
  private constructor() {
    this.priceUpdateCallbacks = new Map();
    this.storage = new PersistentStorage({
      prefix: 'bullstock_price_',
      version: '1.0',
      storageType: 'sessionStorage'
    });
    
    // Initialize from session storage
    const cachedPrices = this.storage.getItem('prices');
    if (cachedPrices) {
      const priceMap = new Map<string, PriceData>();
      Object.entries(cachedPrices).forEach(([ticker, data]) => {
        priceMap.set(ticker, data as PriceData);
      });
      stockUpdatesVar(priceMap);
    }
  }

  static getInstance(): StockPriceCache {
    if (!StockPriceCache.instance) {
      StockPriceCache.instance = new StockPriceCache();
    }
    return StockPriceCache.instance;
  }

  subscribeToPriceUpdates(ticker: string, callback: (price: number) => void) {
    if (!this.priceUpdateCallbacks.has(ticker)) {
      this.priceUpdateCallbacks.set(ticker, new Set());
    }
    this.priceUpdateCallbacks.get(ticker)?.add(callback);

    // Return current price if available
    const currentPrice = this.getPrice(ticker);
    if (currentPrice !== null) {
      callback(currentPrice);
    }
  }

  unsubscribeFromPriceUpdates(ticker: string, callback: (price: number) => void) {
    this.priceUpdateCallbacks.get(ticker)?.delete(callback);
    if (this.priceUpdateCallbacks.get(ticker)?.size === 0) {
      this.priceUpdateCallbacks.delete(ticker);
    }
  }

  updatePrice(ticker: string, price: number) {
    const updates = stockUpdatesVar();
    updates.set(ticker, { price, timestamp: Date.now() });
    stockUpdatesVar(updates);
    
    // Save to storage
    const pricesObject = Object.fromEntries(updates);
    this.storage.setItem('prices', pricesObject);
    
    // Update Apollo cache
    updateStockPrice(ticker, price);
    
    // Notify subscribers
    this.priceUpdateCallbacks.get(ticker)?.forEach(callback => callback(price));
  }

  getPrice(ticker: string): number | null {
    const cached = stockUpdatesVar().get(ticker);
    if (!cached) return null;

    // Price TTL check (10 seconds)
    if (Date.now() - cached.timestamp > 10000) {
      const updates = stockUpdatesVar();
      updates.delete(ticker);
      stockUpdatesVar(updates);
      return null;
    }

    return cached.price;
  }

  clearPrices() {
    stockUpdatesVar(new Map());
    this.storage.removeItem('prices');
    this.priceUpdateCallbacks.clear();
  }

  // Get all active subscriptions
  getActiveSubscriptions(): string[] {
    return Array.from(this.priceUpdateCallbacks.keys());
  }

  // Get number of subscribers for a ticker
  getSubscriberCount(ticker: string): number {
    return this.priceUpdateCallbacks.get(ticker)?.size || 0;
  }

  // Clean up expired prices
  cleanupExpiredPrices() {
    const updates = stockUpdatesVar();
    const now = Date.now();
    
    for (const [ticker, data] of updates) {
      if (now - data.timestamp > 10000) { // 10 seconds TTL
        updates.delete(ticker);
      }
    }
    
    stockUpdatesVar(updates);
    this.storage.setItem('prices', Object.fromEntries(updates));
  }
}