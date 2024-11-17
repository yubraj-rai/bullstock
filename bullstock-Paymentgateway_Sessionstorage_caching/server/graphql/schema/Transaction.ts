export const TransactionTypeDef = `#graphql
    scalar Date
    type Transaction {
        userId: String!
        type: String!
        ticker: String!
        shares: Int!
        totalAmount: Float!
        stockPrice: Float!
        date: Date!
        paymentMethod: String!
    }

    type Query {
        transactions: [Transaction!]!
    }
`;
