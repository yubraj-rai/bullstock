/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type CreateStripeSessionResponse = {
  __typename?: 'CreateStripeSessionResponse';
  sessionId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type MarketNews = {
  __typename?: 'MarketNews';
  description?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['Date']['output']>;
  title: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  buyStock: StockTransactionResponse;
  createStripeAccountLink: StripeAccountLinkResponse;
  createStripeSession?: Maybe<CreateStripeSessionResponse>;
  deposit: TransactionResponse;
  googleLogin?: Maybe<UserResponse>;
  loginUser: UserResponse;
  ownStock: StockTransactionResponse;
  registerUser: UserResponse;
  resetPassword?: Maybe<Scalars['String']['output']>;
  sellStock: StockTransactionResponse;
  sendOtp?: Maybe<Scalars['String']['output']>;
  verifyOtp?: Maybe<Scalars['String']['output']>;
  verifyPayment: PaymentVerificationResponse;
  withdraw: TransactionResponse;
};


export type MutationBuyStockArgs = {
  shares: Scalars['Int']['input'];
  ticker: Scalars['String']['input'];
};


export type MutationCreateStripeAccountLinkArgs = {
  userId: Scalars['String']['input'];
};


export type MutationCreateStripeSessionArgs = {
  amount: Scalars['Float']['input'];
};


export type MutationDepositArgs = {
  amount: Scalars['Float']['input'];
};


export type MutationGoogleLoginArgs = {
  googleToken: Scalars['String']['input'];
};


export type MutationLoginUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationOwnStockArgs = {
  shares: Scalars['Int']['input'];
  ticker: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  confirmPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  confirmPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSellStockArgs = {
  shares: Scalars['Int']['input'];
  ticker: Scalars['String']['input'];
};


export type MutationSendOtpArgs = {
  username: Scalars['String']['input'];
};


export type MutationVerifyOtpArgs = {
  otp: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationVerifyPaymentArgs = {
  sessionId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationWithdrawArgs = {
  amount: Scalars['Float']['input'];
};

export type OwnedStock = Stock & {
  __typename?: 'OwnedStock';
  _id: Scalars['String']['output'];
  country: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  exchange: Scalars['String']['output'];
  industry: Scalars['String']['output'];
  initialInvestment: Scalars['Float']['output'];
  ipo: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  shares: Scalars['Int']['output'];
  ticker: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  weburl: Scalars['String']['output'];
};

export type PaymentVerificationResponse = {
  __typename?: 'PaymentVerificationResponse';
  amount?: Maybe<Scalars['Float']['output']>;
  message: Scalars['String']['output'];
  newBalance: Scalars['Float']['output'];
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  getMarketNews?: Maybe<Array<Maybe<MarketNews>>>;
  getUser: UserResponse;
  ownedStock: OwnedStock;
  ownedStocks: Array<Maybe<OwnedStock>>;
  searchStocks: Array<Maybe<StockData>>;
  stock: StockData;
  transactions: Array<Transaction>;
};


export type QueryGetMarketNewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOwnedStockArgs = {
  ticker?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchStocksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  random?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockArgs = {
  ticker?: InputMaybe<Scalars['String']['input']>;
};

export type Stock = {
  country: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  exchange: Scalars['String']['output'];
  industry: Scalars['String']['output'];
  ipo: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  ticker: Scalars['String']['output'];
  weburl: Scalars['String']['output'];
};

export type StockData = Stock & {
  __typename?: 'StockData';
  country: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  exchange: Scalars['String']['output'];
  industry: Scalars['String']['output'];
  ipo: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  ticker: Scalars['String']['output'];
  weburl: Scalars['String']['output'];
};

export type StripeAccountLinkResponse = {
  __typename?: 'StripeAccountLinkResponse';
  stripeAccountId?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  date: Scalars['Date']['output'];
  paymentMethod: Scalars['String']['output'];
  shares?: Maybe<Scalars['Int']['output']>;
  stockPrice?: Maybe<Scalars['Float']['output']>;
  ticker?: Maybe<Scalars['String']['output']>;
  totalAmount: Scalars['Float']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  message?: Maybe<Scalars['String']['output']>;
  newBalance?: Maybe<Scalars['Float']['output']>;
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  isKycVerified: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
  stripeAccountId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type StockTransactionResponse = {
  __typename?: 'stockTransactionResponse';
  newBalance: Scalars['Float']['output'];
  ownedStock: OwnedStock;
};

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'UserResponse', token?: string | null, user?: { __typename?: 'User', _id: string, username: string, createdAt: any, updatedAt: any, balance: number, stripeAccountId?: string | null, isKycVerified: boolean } | null } };

export type GetTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', userId: string, type: string, ticker?: string | null, shares?: number | null, totalAmount: number, stockPrice?: number | null, date: any }> };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserResponse', token?: string | null, user?: { __typename?: 'User', _id: string, username: string, balance: number, stripeAccountId?: string | null, isKycVerified: boolean } | null } };

export type CreateStripeSessionMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
}>;


export type CreateStripeSessionMutation = { __typename?: 'Mutation', createStripeSession?: { __typename?: 'CreateStripeSessionResponse', sessionId: string, url: string } | null };

export type DepositMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
}>;


export type DepositMutation = { __typename?: 'Mutation', deposit: { __typename?: 'TransactionResponse', success: boolean, message?: string | null, newBalance?: number | null } };

export type WithdrawMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
}>;


export type WithdrawMutation = { __typename?: 'Mutation', withdraw: { __typename?: 'TransactionResponse', success: boolean, message?: string | null, newBalance?: number | null } };

export type CreateStripeAccountLinkMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type CreateStripeAccountLinkMutation = { __typename?: 'Mutation', createStripeAccountLink: { __typename?: 'StripeAccountLinkResponse', success: boolean, url?: string | null, stripeAccountId?: string | null } };

export type VerifyPaymentMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}>;


export type VerifyPaymentMutation = { __typename?: 'Mutation', verifyPayment: { __typename?: 'PaymentVerificationResponse', success: boolean, message: string, amount?: number | null, newBalance: number } };

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', token?: string | null, user?: { __typename?: 'User', _id: string, balance: number, username: string } | null } };

export type SendOtpMutationVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type SendOtpMutation = { __typename?: 'Mutation', sendOtp?: string | null };

export type VerifyOtpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp?: string | null };

export type GoogleLoginMutationVariables = Exact<{
  googleToken: Scalars['String']['input'];
}>;


export type GoogleLoginMutation = { __typename?: 'Mutation', googleLogin?: { __typename?: 'UserResponse', token?: string | null, user?: { __typename?: 'User', _id: string, username: string, balance: number } | null } | null };

export type SearchStocksQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  random?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SearchStocksQuery = { __typename?: 'Query', searchStocks: Array<{ __typename?: 'StockData', ticker: string, name: string, exchange: string, price: number, logo: string, ipo: string, industry: string, country: string, currency: string, weburl: string } | null> };

export type GetOwnedStocksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOwnedStocksQuery = { __typename?: 'Query', ownedStocks: Array<{ __typename?: 'OwnedStock', _id: string, userId: string, ticker: string, shares: number, initialInvestment: number, name: string, exchange: string, price: number, logo: string, ipo: string, industry: string, country: string, currency: string, weburl: string } | null> };

export type BuyStockMutationVariables = Exact<{
  ticker: Scalars['String']['input'];
  shares: Scalars['Int']['input'];
}>;


export type BuyStockMutation = { __typename?: 'Mutation', buyStock: { __typename?: 'stockTransactionResponse', newBalance: number, ownedStock: { __typename?: 'OwnedStock', _id: string, userId: string, ticker: string, shares: number, initialInvestment: number, logo: string, price: number } } };

export type SellStockMutationVariables = Exact<{
  ticker: Scalars['String']['input'];
  shares: Scalars['Int']['input'];
}>;


export type SellStockMutation = { __typename?: 'Mutation', sellStock: { __typename?: 'stockTransactionResponse', newBalance: number, ownedStock: { __typename?: 'OwnedStock', _id: string, userId: string, ticker: string, shares: number, initialInvestment: number } } };

export type GetstockQueryVariables = Exact<{
  ticker?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetstockQuery = { __typename?: 'Query', stock: { __typename?: 'StockData', ticker: string, name: string, exchange: string, price: number, logo: string, ipo: string, industry: string, country: string, currency: string, weburl: string } };

export type GetMarketNewsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetMarketNewsQuery = { __typename?: 'Query', getMarketNews?: Array<{ __typename?: 'MarketNews', title: string, description?: string | null, url?: string | null, imageUrl?: string | null, publishedAt?: any | null } | null> | null };

export type ResetPasswordMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: string | null };


export const LoginUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"isKycVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginUserMutation, LoginUserMutationVariables>;
export const GetTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"stockPrice"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<GetTransactionsQuery, GetTransactionsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"isKycVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const CreateStripeSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStripeSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripeSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<CreateStripeSessionMutation, CreateStripeSessionMutationVariables>;
export const DepositDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Deposit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deposit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"newBalance"}}]}}]}}]} as unknown as DocumentNode<DepositMutation, DepositMutationVariables>;
export const WithdrawDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Withdraw"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"withdraw"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"newBalance"}}]}}]}}]} as unknown as DocumentNode<WithdrawMutation, WithdrawMutationVariables>;
export const CreateStripeAccountLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStripeAccountLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripeAccountLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}}]}}]}}]} as unknown as DocumentNode<CreateStripeAccountLinkMutation, CreateStripeAccountLinkMutationVariables>;
export const VerifyPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"newBalance"}}]}}]}}]} as unknown as DocumentNode<VerifyPaymentMutation, VerifyPaymentMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"confirmPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const SendOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<SendOtpMutation, SendOtpMutationVariables>;
export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}]}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const GoogleLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoogleLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"googleToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"googleToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"googleToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const SearchStocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchStocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"random"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchStocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"random"},"value":{"kind":"Variable","name":{"kind":"Name","value":"random"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchange"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"ipo"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"weburl"}}]}}]}}]} as unknown as DocumentNode<SearchStocksQuery, SearchStocksQueryVariables>;
export const GetOwnedStocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOwnedStocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownedStocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"initialInvestment"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchange"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"ipo"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"weburl"}}]}}]}}]} as unknown as DocumentNode<GetOwnedStocksQuery, GetOwnedStocksQueryVariables>;
export const BuyStockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BuyStock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shares"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buyStock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticker"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}}},{"kind":"Argument","name":{"kind":"Name","value":"shares"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shares"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownedStock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"initialInvestment"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"newBalance"}}]}}]}}]} as unknown as DocumentNode<BuyStockMutation, BuyStockMutationVariables>;
export const SellStockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SellStock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shares"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sellStock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticker"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}}},{"kind":"Argument","name":{"kind":"Name","value":"shares"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shares"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownedStock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"initialInvestment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"newBalance"}}]}}]}}]} as unknown as DocumentNode<SellStockMutation, SellStockMutationVariables>;
export const GetstockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GETSTOCK"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticker"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticker"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticker"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchange"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"ipo"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"weburl"}}]}}]}}]} as unknown as DocumentNode<GetstockQuery, GetstockQueryVariables>;
export const GetMarketNewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketNews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMarketNews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}}]}}]} as unknown as DocumentNode<GetMarketNewsQuery, GetMarketNewsQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"confirmPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;