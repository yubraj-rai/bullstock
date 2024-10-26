import { OwnedStock } from '../../models/OwnedStock';
import { Transaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { verifyToken } from '../../middleware/auth';
import { Stock } from '../../models/Stock';
import { GraphQLError } from 'graphql';

async function clearFirstTransaction(userId) {
    try {
        const countTransactions = await Transaction.find({ userId }).countDocuments();
        if (countTransactions > 50) {
            await Transaction.findOneAndDelete({ userId }, { sort: { ['date']: 1 } });
        }
    } catch (error) {
        return { error: 'Failure to cleanup transaction logs!' };
    }
}

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
            const { token } = context;

            const authResult = await verifyToken(token);

            if (authResult.error) {
                throw new GraphQLError(authResult.error, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            const stock = await Stock.findOne({ ticker });
            const user = await User.findOne({ _id: authResult.userId });
            const alreadyOwned = (await OwnedStock.find({ userId: authResult.userId, ticker }).countDocuments()) > 0;
            const cost = shares * stock.price;

            if (cost > user.balance) {
                throw new GraphQLError("Can't afford transaction. $" + (cost - user.balance).toFixed(2) + ' more required.', {
                    extensions: {
                        code: 'INSUFFICIENT_FUNDS',
                    },
                });
            }

            if (alreadyOwned) {
                const ownedStock = await OwnedStock.findOneAndUpdate(
                    { userId: authResult.userId, ticker },
                    { $inc: { shares, initialInvestment: cost } },
                    { new: true }
                );

                await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: -cost } });

                const newTransaction = new Transaction({ userId: authResult.userId, type: 'BUY', ticker, shares, totalAmount: cost, stockPrice: stock.price });
                await newTransaction.save();

                clearFirstTransaction(authResult.userId);
                return { ownedStock, price: stock.price, newBalance: user.balance - cost };
            } else {
                const newOwnedStock = new OwnedStock({
                    userId: authResult.userId,
                    ticker,
                    shares,
                    initialInvestment: cost,
                });

                const result = await newOwnedStock.save();
                await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: -cost } });

                const newTransaction = new Transaction({ userId: authResult.userId, type: 'BUY', ticker, shares, totalAmount: cost, stockPrice: stock.price });
                await newTransaction.save();

                clearFirstTransaction(authResult.userId);
                return { ownedStock: result, newBalance: user.balance - cost };
            }
        },
        sellStock: async (_, { ticker, shares }, context) => {
            // Placeholder resolver for sellStock mutation
            return { ownedStock: null, newBalance: 0 }; // Returning default values
        },
    },
};
