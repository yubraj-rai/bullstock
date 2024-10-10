import { OwnedStock } from '../../models/OwnedStock';
import { Transaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { verifyToken } from '../../middleware/auth';
import { Stock } from '../../models/Stock';
import { GraphQLError } from 'graphql';

export const OwnedStockResolver = {
    Query: {
        ownedStocks: async (_, args, context) => {
            // Placeholder resolver for ownedStocks query
            return []; // Returning an empty array
        },
        ownedStock: async (_, { ticker }, context) => {
            // Placeholder resolver for ownedStock query
            return null; // Returning null
        },
    },
    Mutation: {
        buyStock: async (_, { ticker, shares }, context) => {
            // Placeholder resolver for buyStock mutation
            return { ownedStock: null, price: 0, newBalance: 0 }; // Returning default values
        },
        sellStock: async (_, { ticker, shares }, context) => {
            // Placeholder resolver for sellStock mutation
            return { ownedStock: null, newBalance: 0 }; // Returning default values
        },
    },
};
