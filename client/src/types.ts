import { OwnedStock } from "./__generated__/graphql";

interface Stock {
  ticker: string;
  name: string;
  price: number;
  exchange: string;
  industry: string;
  logo: string;
  ipo: string;
  country: string;
  currency: string;
  weburl: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  googleId?: string; // Optional because it allows `null` values
  otp?: string; // Optional because it's not always required
  otpExpiry?: Date; // Optional because it's not always required
  stripeAccountId: string;
  isKycVerified: Boolean ;
  
}

interface StockUpdate {
  price: number;
}

interface StockState {
  stocksReducer: StockUpdate;
}

interface AuthData {
  user: User;
  token: string;
}

interface AuthReducer {
  authData: AuthData;
}

interface AuthState {
  authReducer: AuthReducer;
}

interface OwnedStocksReducer {
  ownedStocks: OwnedStock[];
}

interface OwnedStocksState {
  ownedStocksReducer: OwnedStocksReducer;
}

export type { Stock, StockUpdate, StockState, AuthState, OwnedStocksState };
