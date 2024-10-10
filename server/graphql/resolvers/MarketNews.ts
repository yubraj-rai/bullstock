import { MarketNews } from '../../models/MarketNews';

export const marketNewsResolvers = {
    Query: {
      // Resolver to get the latest market news
      getLatestMarketNews: async (_: any, { limit }: { limit: number }) => {
        // Implementation will go here
      },
    },
  };
  
