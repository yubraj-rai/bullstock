import { OwnedStock } from '../../models/OwnedStock';
import { Transaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { verifyToken } from '../../middleware/auth';
import { Stock } from '../../models/Stock';
import { GraphQLError } from 'graphql';
const { sendEmail } = require('./mailer');


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
            const { token } = context;

            const result = await verifyToken(token);

            if (result.error) {
                throw new GraphQLError(result.error, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            const ownedStocks = await OwnedStock.find({ userId: result.userId }).sort({ ['userId']: 1 });

            const stockData = [];

            for (const stock of ownedStocks) {
                const stockInfo = await Stock.findOne({ ticker: stock.ticker });
                stockData.push(stockInfo);
            }

            const merged = ownedStocks.map((stock, index) => {
                return { ...stock.toJSON(), ...stockData[index]._doc };
            })

            return merged;
        },
        ownedStock: async (_, { ticker }, context) => {
            const { token } = context;

            const result = await verifyToken(token);

            if (result.error) {
                throw new GraphQLError(result.error, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            const ownedStock = await OwnedStock.find({ userId: result.userId, ticker });

            return ownedStock;
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
        
            let ownedStock;
        
            if (alreadyOwned) {
                ownedStock = await OwnedStock.findOneAndUpdate(
                    { userId: authResult.userId, ticker },
                    { $inc: { shares, initialInvestment: cost } },
                    { new: true }
                );
            } else {
                ownedStock = new OwnedStock({
                    userId: authResult.userId,
                    ticker,
                    shares,
                    initialInvestment: cost,
                });
                await ownedStock.save();
            }
        
            await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: -cost } });
        
            const newTransaction = new Transaction({
                userId: authResult.userId,
                type: 'BUY',
                ticker,
                shares,
                totalAmount: cost,
                stockPrice: stock.price,
            });
            await newTransaction.save();
            ownedStock.price = stock.price;
            ownedStock.logo = stock.logo;
            // Send email notification
            const subject = `Stock Purchase Confirmation: ${ticker}`;
            const html = `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333;">Purchase Confirmation</h2>
                            <p style="color: #555;">Dear User,</p>
                            <p style="color: #555;">You have successfully purchased <strong>${shares} shares</strong> of <strong>${ticker}</strong>.</p>
                            <p style="color: #555;">Here are the details of your transaction:</p>
                            <ul style="color: #555; list-style-type: none; padding: 0;">
                                <li><strong>Price per Share:</strong> $${stock.price.toFixed(2)}</li>
                                <li><strong>Total Cost:</strong> $${cost.toFixed(2)}</li>
                                <li><strong>New Balance:</strong> $${(user.balance - cost).toFixed(2)}</li>
                            </ul>
                            <p style="color: #555;">Thank you for choosing our service. If you have any questions, feel free to reach out to our support team.</p>
                            <footer style="margin-top: 20px; font-size: 0.8em; color: #999;">
                                <p>Best Regards,<br>BullStocks</p>
                            </footer>
                        </div>
                    </body>
                </html>
            `;
            // const text = `You have successfully purchased ${shares} shares of ${ticker} at $${stock.price} each. Your total cost is $${cost}. Your new balance is $${user.balance - cost}.`;
            await sendEmail(user.username, subject, html);
        
            clearFirstTransaction(authResult.userId);
            return { ownedStock, price: stock.price, newBalance: user.balance - cost };
        },
        sellStock: async (_, { ticker, shares }, context) => {
            const { token } = context;

            const authResult = await verifyToken(token);

            if (authResult.error) {
                throw new GraphQLError(authResult.error, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            const ownedStock = await OwnedStock.findOne({ userId: authResult.userId, ticker });

            if (!ownedStock) {
                throw new GraphQLError('Stock not owned', {
                    extensions: {
                        code: 'BAD_REQUEST',
                    },
                });
            }

            if (ownedStock.shares < shares) {
                throw new GraphQLError('Invalid shares', {
                    extensions: {
                        code: 'INVALID_SHARES',
                    },
                });
            }

            const stock = await Stock.findOne({ ticker });
            const profit = stock.price * shares;
            const initialInvestment = ownedStock.initialInvestment - (ownedStock.initialInvestment * shares) / ownedStock.shares;

            const result = await OwnedStock.findOneAndUpdate(
                { userId: authResult.userId, ticker },
                { $inc: { shares: -shares }, initialInvestment },
                { new: true }
            );

            const newTransaction = new Transaction({
                userId: authResult.userId,
                type: 'SELL',
                ticker,
                shares,
                totalAmount: profit,
                stockPrice: stock.price,
            });
            await newTransaction.save();

            if (result.shares === 0) {
                await OwnedStock.findOneAndDelete({ userId: authResult.userId, ticker });
            }

            const user = await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: profit } }, { new: true });

            clearFirstTransaction(authResult.userId);
            // Prepare email content
            const subject = `Stock Sale Confirmation: ${ticker}`;
            const html = `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333;">Sale Confirmation</h2>
                            <p style="color: #555;">Dear User,</p>
                            <p style="color: #555;">You have successfully sold <strong>${shares} shares</strong> of <strong>${ticker}</strong>.</p>
                            <p style="color: #555;">Here are the details of your transaction:</p>
                            <ul style="color: #555; list-style-type: none; padding: 0;">
                                <li><strong>Price per Share:</strong> $${stock.price.toFixed(2)}</li>
                                <li><strong>Total Profit:</strong> $${profit.toFixed(2)}</li>
                                <li><strong>New Balance:</strong> $${user.balance.toFixed(2)}</li>
                            </ul>
                            <p style="color: #555;">Thank you for choosing our service. If you have any questions, feel free to reach out to our support team.</p>
                            <footer style="margin-top: 20px; font-size: 0.8em; color: #999;">
                                <p>Best Regards,<br>BullStocks</p>
                            </footer>
                        </div>
                    </body>
                </html>
            `;
        
            // Send the email notification
            await sendEmail(user.username, subject, html);

            return { ownedStock: result, newBalance: user.balance };
        },
    },
};
