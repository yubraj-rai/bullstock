export type Scalars = {
    Date: {
      output: string; // You can modify this type to match the actual type used for date, like Date | string.
    };
    Int: {
      output: number;
    };
    Float: {
      output: number;
    };
    String: {
      output: string;
    };
  };
  
  export type Transaction = {
    __typename?: 'Transaction';
    date: Scalars['Date']['output'];
    shares: Scalars['Int']['output'];
    stockPrice: Scalars['Float']['output'];
    ticker: Scalars['String']['output'];
    totalAmount: Scalars['Float']['output'];
    type: Scalars['String']['output'];
    userId: Scalars['String']['output'];
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
  