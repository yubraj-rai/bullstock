import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { Stock, StockUpdate } from '../types';
import { PersistentStorage } from './persistentStorage';

interface CachedTransaction {
    userId: string;
    type: string;
    ticker: string;
    shares: number;
    totalAmount: number;
    stockPrice: number;
    date: string;
    paymentMethod?: string;
}

// Reactive variables for real-time data
export const currentPricesVar: ReactiveVar<Record<string, number>> = makeVar<Record<string, number>>({});
export const stockUpdatesVar: ReactiveVar<Map<string, { price: number; timestamp: number }>> = makeVar(new Map());
export const marketNewsVar: ReactiveVar<any[]> = makeVar<any[]>([]);
export const userBalanceVar: ReactiveVar<number> = makeVar<number>(0);
export const userPortfolioVar: ReactiveVar<any[]> = makeVar<any[]>([]);

// Configure cache persistence
export const persistentStorage = new PersistentStorage({
  prefix: 'bullstock_',
  version: '1.0',
  storageType: 'localStorage'
});

// Configure Apollo Cache
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchStocks: {
          keyArgs: ['search'],
          merge(existing, incoming, { args }) {
            if (args?.random) return incoming;
            return {
              ...incoming,
              __cacheTime: Date.now()
            };
          },
          read(existing) {
            if (!existing) return undefined;
            if (Date.now() - existing.__cacheTime > 60000) return undefined; // 1 minute cache
            return existing;
          }
        },
        getMarketNews: {
          merge(existing, incoming) {
            marketNewsVar(incoming);
            return {
              ...incoming,
              __cacheTime: Date.now()
            };
          },
          read(existing) {
            if (!existing) return undefined;
            if (Date.now() - existing.__cacheTime > 900000) return undefined; // 15 minutes cache
            return existing;
          }
        },
        transactions: {
          keyArgs: ['userId'],
          merge(existing = [], incoming: CachedTransaction[]) {
            return [...incoming];
          }
        },
        ownedStocks: {
          merge(existing, incoming) {
            userPortfolioVar(incoming);
            return incoming;
          }
        },
        getUser: {
          merge(existing, incoming) {
            if (incoming?.user?.balance) {
              userBalanceVar(incoming.user.balance);
            }
            return incoming;
          }
        }
      }
    },
    Stock: {
      keyFields: ['ticker'],
      fields: {
        price: {
          read(price: number, { readField }) {
            const ticker = readField('ticker') as string;
            const cachedPrice = stockUpdatesVar().get(ticker)?.price;
            return cachedPrice || price;
          }
        }
      }
    },
    OwnedStock: {
      keyFields: ['userId', 'ticker'],
      fields: {
        shares: {
          merge: true
        },
        initialInvestment: {
          merge: true
        }
      }
    },
    Transaction: {
      keyFields: ['userId', 'date', 'ticker'],
      fields: {
        totalAmount: {
          merge: true
        },
        shares: {
          merge: true
        }
      }
    },
    User: {
      keyFields: ['_id'],
      fields: {
        balance: {
          merge: true
        },
        username: {
          merge: true
        }
      }
    }
  }
});

// Cache helpers
export const clearUserCache = () => {
  userBalanceVar(0);
  userPortfolioVar([]);
  persistentStorage.clear();
  cache.evict({ fieldName: 'getUser' });
  cache.evict({ fieldName: 'transactions' });
  cache.evict({ fieldName: 'ownedStocks' });
  cache.gc();
};

export const updateStockPrice = (ticker: string, newPrice: number) => {
  const updates = stockUpdatesVar();
  updates.set(ticker, { price: newPrice, timestamp: Date.now() });
  stockUpdatesVar(updates);

  cache.modify({
    id: cache.identify({ __typename: 'Stock', ticker }),
    fields: {
      price() {
        return newPrice;
      }
    }
  });
};

// Price update helpers
export const getPriceFromCache = (ticker: string): number | null => {
  const cached = stockUpdatesVar().get(ticker);
  if (!cached) return null;
  
  // Invalidate cache after 10 seconds
  if (Date.now() - cached.timestamp > 10000) {
    const updates = stockUpdatesVar();
    updates.delete(ticker);
    stockUpdatesVar(updates);
    return null;
  }
  
  return cached.price;
};

export const updateCachedPrice = (ticker: string, price: number) => {
  const updates = stockUpdatesVar();
  updates.set(ticker, {
    price,
    timestamp: Date.now()
  });
  stockUpdatesVar(updates);
  
  // Update Apollo cache as well
  cache.modify({
    id: cache.identify({ __typename: 'Stock', ticker }),
    fields: {
      price() {
        return price;
      }
    }
  });
};

// Market News helpers
export const updateMarketNews = (news: any[]) => {
  marketNewsVar(news);
  cache.modify({
    fields: {
      getMarketNews() {
        return news;
      }
    }
  });
};

// Portfolio helpers
export const updatePortfolio = (stocks: any[]) => {
  userPortfolioVar(stocks);
  cache.modify({
    fields: {
      ownedStocks() {
        return stocks;
      }
    }
  });
};

// Balance helpers
export const updateUserBalance = (newBalance: number) => {
  userBalanceVar(newBalance);
  cache.modify({
    fields: {
      getUser(existing) {
        return {
          ...existing,
          user: {
            ...existing.user,
            balance: newBalance
          }
        };
      }
    }
  });
};

// Transaction helpers
export const addTransaction = (transaction: CachedTransaction) => {
  cache.modify({
    fields: {
      transactions(existing = []) {
        return [transaction, ...existing];
      }
    }
  });
};

// WebSocket event handlers
export const handlePriceUpdate = (ticker: string, price: number) => {
  updateCachedPrice(ticker, price);
  
  // Update owned stocks calculations if needed
  const portfolio = userPortfolioVar();
  const ownedStock = portfolio.find(stock => stock.ticker === ticker);
  if (ownedStock) {
    const updatedPortfolio = portfolio.map(stock => 
      stock.ticker === ticker 
        ? { ...stock, currentValue: stock.shares * price }
        : stock
    );
    updatePortfolio(updatedPortfolio);
  }
};

// Cache initialization
export const initializeCache = () => {
  // Load persisted data
  const persistedPrices = persistentStorage.getItem('stockPrices');
  if (persistedPrices) {
    stockUpdatesVar(new Map(Object.entries(persistedPrices)));
  }

  const persistedBalance = persistentStorage.getItem('userBalance');
  if (persistedBalance !== null) {
    userBalanceVar(persistedBalance);
  }

  // Set up cache persistence
  window.addEventListener('beforeunload', () => {
    persistentStorage.setItem('stockPrices', Object.fromEntries(stockUpdatesVar()));
    persistentStorage.setItem('userBalance', userBalanceVar());
  });
};