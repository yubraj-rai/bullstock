import { Stock } from '../../models/Stock';

export const StockResolver = {
    Query: {
        searchStocks: async (_, { search = null, limit, random }) => {
            // Placeholder resolver for searchStocks query
            return []; // Returning an empty array
        },
        stock: async (_, { ticker }) => {
            // Placeholder resolver for stock query
            return null; // Returning null
        },
    },
};