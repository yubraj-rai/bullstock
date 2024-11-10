import { OwnedStock } from "./_generated_/graphql";

interface User {
    _id: string;
    username: string;
    balance: number;
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

interface StockUpdate {
    price: number;
}

interface OwnedStocksReducer {
    ownedStocks: OwnedStock[];
}

interface OwnedStocksState {
    ownedStocksReducer: OwnedStocksReducer;
}


export type { AuthState, Stock, StockUpdate, OwnedStocksState};
