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
  