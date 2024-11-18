// graphql/schema/MarketNews.ts
export const MarketNewsTypeDef = `#graphql
    type MarketNews {
        title: String!
        description: String
        url: String
        imageUrl: String
        publishedAt: Date
    }

    extend type Query {
        getMarketNews(limit: Int, offset: Int): [MarketNews]
    }
`;
