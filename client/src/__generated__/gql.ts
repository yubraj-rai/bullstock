/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation LoginUser($username: String!, $password: String!) {\n    loginUser(username: $username, password: $password) {\n      user {\n        _id\n        username\n        createdAt\n        updatedAt\n        balance\n        stripeAccountId\n        isKycVerified\n      }\n      token\n    }\n  }\n": types.LoginUserDocument,
    "\n  query GetTransactions {\n      transactions {\n          userId\n          type\n          ticker\n          shares\n          totalAmount\n          stockPrice\n          date\n      }\n  }\n": types.GetTransactionsDocument,
    "\n    query GetUser {\n        getUser {\n            user {\n                _id\n                username\n                balance\n                stripeAccountId\n                isKycVerified\n            }\n            token\n        }\n    }\n": types.GetUserDocument,
    "\n  mutation CreateStripeSession($amount: Float!) {\n    createStripeSession(amount: $amount) {\n      sessionId\n      url\n    }\n  }\n": types.CreateStripeSessionDocument,
    "\n  mutation Deposit($amount: Float!) {\n    deposit(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n": types.DepositDocument,
    "\n  mutation Withdraw($amount: Float!) {\n    withdraw(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n": types.WithdrawDocument,
    "\n  mutation CreateStripeAccountLink($userId: String!) {\n    createStripeAccountLink(userId: $userId) {\n      success\n      url\n      stripeAccountId\n    }\n  }\n": types.CreateStripeAccountLinkDocument,
    "\n  mutation VerifyPayment($userId: String!, $sessionId: String!) {\n    verifyPayment(userId: $userId, sessionId: $sessionId) {\n      success\n      message\n      amount\n      newBalance\n    }\n  }\n": types.VerifyPaymentDocument,
    "\n    mutation RegisterUser($username: String!, $password: String!, $confirmPassword: String!) {\n        registerUser(username: $username, password: $password, confirmPassword: $confirmPassword) {\n            user {\n                _id\n                balance\n                username\n            }\n            token\n        }\n    }\n": types.RegisterUserDocument,
    "\n  mutation SendOtp($username: String!) {\n    sendOtp(username: $username)\n  }\n": types.SendOtpDocument,
    "\n  mutation VerifyOtp($username: String!, $otp: String!) {\n    verifyOtp(username: $username, otp: $otp)\n  }\n": types.VerifyOtpDocument,
    "\n  mutation GoogleLogin($googleToken: String!) {\n    googleLogin(googleToken: $googleToken) {\n      user {\n        _id\n        username\n        balance\n      }\n      token\n    }\n  }\n": types.GoogleLoginDocument,
    "\n  query SearchStocks($search: String, $limit: Int, $random: Boolean) {\n      searchStocks(search: $search, limit: $limit, random: $random) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n": types.SearchStocksDocument,
    "\n  query GetOwnedStocks {\n      ownedStocks {\n          _id\n          userId\n          ticker\n          shares\n          initialInvestment\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n": types.GetOwnedStocksDocument,
    "\n  mutation BuyStock($ticker: String!, $shares: Int!) {\n      buyStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n              logo\n              price\n          }\n          newBalance\n      }\n  }\n": types.BuyStockDocument,
    "\n  mutation SellStock($ticker: String!, $shares: Int!) {\n      sellStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n          }\n          newBalance\n      }\n  }\n": types.SellStockDocument,
    "\n  query GETSTOCK($ticker: String) {\n      stock(ticker: $ticker) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n": types.GetstockDocument,
    "\n    query GetMarketNews($limit: Int!, $offset: Int!) {\n        getMarketNews(limit: $limit, offset: $offset) {\n            title\n            description\n            url\n            imageUrl\n            publishedAt\n        }\n    }\n": types.GetMarketNewsDocument,
    "\n  mutation ResetPassword($username: String!, $password: String!, $confirmPassword: String!) {\n    resetPassword(username: $username, password: $password, confirmPassword: $confirmPassword)\n  }\n": types.ResetPasswordDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LoginUser($username: String!, $password: String!) {\n    loginUser(username: $username, password: $password) {\n      user {\n        _id\n        username\n        createdAt\n        updatedAt\n        balance\n        stripeAccountId\n        isKycVerified\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation LoginUser($username: String!, $password: String!) {\n    loginUser(username: $username, password: $password) {\n      user {\n        _id\n        username\n        createdAt\n        updatedAt\n        balance\n        stripeAccountId\n        isKycVerified\n      }\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTransactions {\n      transactions {\n          userId\n          type\n          ticker\n          shares\n          totalAmount\n          stockPrice\n          date\n      }\n  }\n"): (typeof documents)["\n  query GetTransactions {\n      transactions {\n          userId\n          type\n          ticker\n          shares\n          totalAmount\n          stockPrice\n          date\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetUser {\n        getUser {\n            user {\n                _id\n                username\n                balance\n                stripeAccountId\n                isKycVerified\n            }\n            token\n        }\n    }\n"): (typeof documents)["\n    query GetUser {\n        getUser {\n            user {\n                _id\n                username\n                balance\n                stripeAccountId\n                isKycVerified\n            }\n            token\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateStripeSession($amount: Float!) {\n    createStripeSession(amount: $amount) {\n      sessionId\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStripeSession($amount: Float!) {\n    createStripeSession(amount: $amount) {\n      sessionId\n      url\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Deposit($amount: Float!) {\n    deposit(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n"): (typeof documents)["\n  mutation Deposit($amount: Float!) {\n    deposit(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Withdraw($amount: Float!) {\n    withdraw(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n"): (typeof documents)["\n  mutation Withdraw($amount: Float!) {\n    withdraw(amount: $amount) {\n      success\n      message\n      newBalance\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateStripeAccountLink($userId: String!) {\n    createStripeAccountLink(userId: $userId) {\n      success\n      url\n      stripeAccountId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStripeAccountLink($userId: String!) {\n    createStripeAccountLink(userId: $userId) {\n      success\n      url\n      stripeAccountId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyPayment($userId: String!, $sessionId: String!) {\n    verifyPayment(userId: $userId, sessionId: $sessionId) {\n      success\n      message\n      amount\n      newBalance\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyPayment($userId: String!, $sessionId: String!) {\n    verifyPayment(userId: $userId, sessionId: $sessionId) {\n      success\n      message\n      amount\n      newBalance\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RegisterUser($username: String!, $password: String!, $confirmPassword: String!) {\n        registerUser(username: $username, password: $password, confirmPassword: $confirmPassword) {\n            user {\n                _id\n                balance\n                username\n            }\n            token\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterUser($username: String!, $password: String!, $confirmPassword: String!) {\n        registerUser(username: $username, password: $password, confirmPassword: $confirmPassword) {\n            user {\n                _id\n                balance\n                username\n            }\n            token\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SendOtp($username: String!) {\n    sendOtp(username: $username)\n  }\n"): (typeof documents)["\n  mutation SendOtp($username: String!) {\n    sendOtp(username: $username)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyOtp($username: String!, $otp: String!) {\n    verifyOtp(username: $username, otp: $otp)\n  }\n"): (typeof documents)["\n  mutation VerifyOtp($username: String!, $otp: String!) {\n    verifyOtp(username: $username, otp: $otp)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation GoogleLogin($googleToken: String!) {\n    googleLogin(googleToken: $googleToken) {\n      user {\n        _id\n        username\n        balance\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleLogin($googleToken: String!) {\n    googleLogin(googleToken: $googleToken) {\n      user {\n        _id\n        username\n        balance\n      }\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SearchStocks($search: String, $limit: Int, $random: Boolean) {\n      searchStocks(search: $search, limit: $limit, random: $random) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"): (typeof documents)["\n  query SearchStocks($search: String, $limit: Int, $random: Boolean) {\n      searchStocks(search: $search, limit: $limit, random: $random) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetOwnedStocks {\n      ownedStocks {\n          _id\n          userId\n          ticker\n          shares\n          initialInvestment\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"): (typeof documents)["\n  query GetOwnedStocks {\n      ownedStocks {\n          _id\n          userId\n          ticker\n          shares\n          initialInvestment\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BuyStock($ticker: String!, $shares: Int!) {\n      buyStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n              logo\n              price\n          }\n          newBalance\n      }\n  }\n"): (typeof documents)["\n  mutation BuyStock($ticker: String!, $shares: Int!) {\n      buyStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n              logo\n              price\n          }\n          newBalance\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SellStock($ticker: String!, $shares: Int!) {\n      sellStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n          }\n          newBalance\n      }\n  }\n"): (typeof documents)["\n  mutation SellStock($ticker: String!, $shares: Int!) {\n      sellStock(ticker: $ticker, shares: $shares) {\n          ownedStock {\n              _id\n              userId\n              ticker\n              shares\n              initialInvestment\n          }\n          newBalance\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GETSTOCK($ticker: String) {\n      stock(ticker: $ticker) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"): (typeof documents)["\n  query GETSTOCK($ticker: String) {\n      stock(ticker: $ticker) {\n          ticker\n          name\n          exchange\n          price\n          logo\n          ipo\n          industry\n          country\n          currency\n          weburl\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetMarketNews($limit: Int!, $offset: Int!) {\n        getMarketNews(limit: $limit, offset: $offset) {\n            title\n            description\n            url\n            imageUrl\n            publishedAt\n        }\n    }\n"): (typeof documents)["\n    query GetMarketNews($limit: Int!, $offset: Int!) {\n        getMarketNews(limit: $limit, offset: $offset) {\n            title\n            description\n            url\n            imageUrl\n            publishedAt\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ResetPassword($username: String!, $password: String!, $confirmPassword: String!) {\n    resetPassword(username: $username, password: $password, confirmPassword: $confirmPassword)\n  }\n"): (typeof documents)["\n  mutation ResetPassword($username: String!, $password: String!, $confirmPassword: String!) {\n    resetPassword(username: $username, password: $password, confirmPassword: $confirmPassword)\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;