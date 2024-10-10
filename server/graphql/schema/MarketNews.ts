export const MarketNewsTypeDef = `#graphql
    scalar Date
    type MarketNews {
        title: String!
        description: String!
        source: String!
        publishedAt: Date!
        url: Float!
    }

    type Query {
    getLatestMarketNews(limit: Int): [MarketNews]
}

`;
