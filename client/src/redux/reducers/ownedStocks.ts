import { Stock } from '../../_generated_/graphql';
import { OWNED_STOCKS, UPDATE_STOCK } from '../actions';

const ownedStocksReducer = (state = { ownedStocks: [] }, action: any) => {
    const stocks: Stock[] = JSON.parse(JSON.stringify(state.ownedStocks));
    // console.log("stocks :::: owned",stocks);
    
    switch (action.type) {
        case OWNED_STOCKS:
            return { ...state, ownedStocks: action?.payload };
        case UPDATE_STOCK:
            const stockIndex = stocks.findIndex((stock) => stock.ticker === action?.payload?.stock?.ticker);
            
            if (action?.payload?.stock?.shares === 0) {
                // Remove the stock if shares are 0
                if (stockIndex !== -1) {
                    stocks.splice(stockIndex, 1);
                }
            } else {
                if (stockIndex !== -1) {
                    // Update the existing stock if it's already in the list
                    // console.log("action.payload.stock::::",action.payload.stock);
                    // console.log("stocks[stockIndex]::::",stocks[stockIndex]);
                    
                    stocks[stockIndex].shares = action.payload.stock.shares;
                    stocks[stockIndex].initialInvestment = action.payload.stock.initialInvestment;
                } else {
                    // Add the new stock if it doesn't exist in the list
                    stocks.push(action.payload.stock);
                }
            }
            return { ...state, ownedStocks: stocks };
        default:
            return state;
    }
};

export default ownedStocksReducer;
