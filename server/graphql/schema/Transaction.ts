export const TransactionTypeDef = `#graphql
  scalar Date

  type Transaction {
    userId: String!
    type: String!
    ticker: String
    shares: Int
    totalAmount: Float!
    stockPrice: Float
    date: Date!
    paymentMethod: String!
  }

  type CreateStripeSessionResponse {
    sessionId: String!
    url: String!
  }

  type TransactionResponse {
    success: Boolean!
    message: String
    newBalance: Float
  }

  type StripeAccountLinkResponse {
    success: Boolean!
    url: String
    stripeAccountId: String
  }

  type StripeRequirementsResponse {
    success: Boolean!
    requirements: [String!]!
  }


  type PaymentVerificationResponse {
    success: Boolean!
    message: String!
    amount: Float # Add this field if it's missing
    newBalance: Float!
  }



  extend type Query {
    transactions: [Transaction!]!
    checkStripeAccountRequirements(stripeAccountId: String!): StripeRequirementsResponse!
  }

  extend type Mutation {
    createStripeSession(amount: Float!): CreateStripeSessionResponse
    deposit(amount: Float!): TransactionResponse!
    withdraw(amount: Float!): TransactionResponse!
    createStripeAccountLink(userId: String!): StripeAccountLinkResponse!
    verifyPayment(userId: String!, sessionId: String!): PaymentVerificationResponse!
  }
`;

