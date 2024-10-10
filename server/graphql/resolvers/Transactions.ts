import { Transaction } from '../../models/Transaction';
import { verifyToken } from '../../middleware/auth';
import { GraphQLError } from 'graphql';

export const TransactionResolver = {
    Query: {
        transactions: async (_, args, context) => {
            // Placeholder resolver for transactions query
            return []; // Returning an empty array
        },
    },
    
};
