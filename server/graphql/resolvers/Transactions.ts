import { Transaction, BankingTransaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { verifyToken } from '../../middleware/auth';
import { GraphQLError } from 'graphql';
import stripe from '../../utils/stripeInstance';
require('dotenv').config();

export const TransactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      const { token } = context;

      const result = await verifyToken(token);

      if (result.error) {
        throw new GraphQLError(result.error, {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      // Retrieve all transactions (banking and stock-related) for the user
      const stockTransactions = await Transaction.find({ userId: result.userId }).sort({ date: -1 });
      // if (stockTransactions.length > 50) {
      //   await Transaction.findOneAndDelete({ userId: result.userId }, { sort: { ['date']: 1 } });
      // }
      // console.log("stockTransactions :::::",stockTransactions);
      
      // const bankingTransactions = await BankingTransaction.find({ userId: result.userId }).sort({ date: -1 });
      // console.log("bankingTransactions :::::",bankingTransactions);
      return stockTransactions;
      // return {
      //   stockTransactions,
      //   bankingTransactions,
      // };
    },
  },

  Mutation: {
    createStripeSession: async (_, { amount }, context) => {
      try {
        if (!amount || amount <= 0) {
          throw new GraphQLError('Invalid amount. Must be greater than 0.');
        }

        const { token } = context;
        const result = await verifyToken(token);

        if (result.error) {
          throw new GraphQLError(result.error);
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'cad',
                product_data: { name: 'Bullstock Deposit' },
                unit_amount: Math.round(amount * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.CLIENT_URL}/account`,
          cancel_url: `${process.env.CLIENT_URL}/account`,
          metadata: { userId: result.userId, amount },
        });

        return { sessionId: session.id, url: session.url };
      } catch (err) {
        console.error('Error creating Stripe session:', err.message);
        throw new GraphQLError(err.message);
      }
    },

    verifyPayment: async (_, { userId, sessionId }) => {
      try {    
        const transaction = await BankingTransaction.findOne({
          userId,
          stripeSessionId: sessionId,
          type: 'Deposit',
          status: 'Completed',
        });
    
        if (!transaction) {
          console.error('No completed transaction found for user:', userId);
          return {
            success: false,
            message: 'No completed transaction found',
          };
        }
    
        const user = await User.findById(userId);
        if (!user) {
          console.error('User not found for userId:', userId);
          return {
            success: false,
            message: 'User not found',
          };
        }
    
        return {
          success: true,
          message: 'Payment verified successfully',
          amount: transaction.totalAmount, // Include the amount
          newBalance: user.balance,
        };
      } catch (err) {
        console.error('Error verifying payment:', err);
        throw new GraphQLError('Failed to verify payment', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    

    deposit: async (_, { amount }, context) => {
      const { token } = context;

      const result = await verifyToken(token);

      if (result.error) {
        throw new GraphQLError(result.error, {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const user = await User.findById(result.userId);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      }

      // Create a banking transaction for deposit
      const transaction = new BankingTransaction({
        userId: user.id,
        type: 'Deposit',
        totalAmount: amount,
        paymentMethod: 'Stripe',
        status: 'Completed',
      });

      user.balance += amount;

      await Promise.all([transaction.save(), user.save()]);

      return {
        success: true,
        message: 'Deposit successful',
        newBalance: user.balance,
      };
    },

    withdraw: async (_, { amount }, context) => {
      const { token } = context;
  
      // Authenticate the user using the provided token
      const result = await verifyToken(token);
      if (result.error) {
          throw new GraphQLError(result.error, {
              extensions: {
                  code: 'UNAUTHORIZED',
              },
          });
      }
  
      // Retrieve the user from the database
      const user = await User.findById(result.userId);
      if (!user) {
          throw new GraphQLError('User not found', {
              extensions: { code: 'USER_NOT_FOUND' },
          });
      }
  
      try {
          // Create a Stripe transfer to the user's connected account
          console.log(`Initiating transfer of ${amount} CAD to Stripe account: ${user.stripeAccountId}`);
          const transfer = await stripe.transfers.create({
              amount: Math.round(amount * 100), 
              currency: 'cad',
              destination: user.stripeAccountId,
          });

          console.log(`Transfer successful. Transfer ID: ${transfer.id}`);

  
          console.log(`Initiating payout of ${amount} CAD from Stripe account: ${user.stripeAccountId}`);
          const payout = await stripe.payouts.create(
              {
                  amount: Math.round(amount * 100),
                  currency: 'cad',
              },
              {
                  stripeAccount: user.stripeAccountId, 
              }
          );
          console.log(`Payout successful. Payout ID: ${payout.id}`);
  
          const transaction = new BankingTransaction({
              userId: user.id,
              type: 'Withdrawal',
              totalAmount: amount,
              paymentMethod: 'Stripe',
              status: 'Completed',
              stripeTransferId: transfer.id,
              stripePayoutId: payout.id,
          });
  
          user.balance -= amount;
  
          await Promise.all([transaction.save(), user.save()]);
          console.log(`Withdrawal completed. New balance: ${user.balance}`);
  
          return {
              success: true,
              message: 'Withdrawal successful',
              newBalance: user.balance,
          };
      } catch (error) {
          if (error.type === 'StripeInvalidRequestError') {
              console.error('Invalid request to Stripe API:', error.message);
          } else if (error.type === 'StripeCardError') {
              console.error('Card error during transfer or payout:', error.message);
          } else if (error.type === 'StripeAPIError') {
              console.error('Stripe API error:', error.message);
          } else if (error.type === 'StripeConnectionError') {
              console.error('Network error with Stripe:', error.message);
          } else {
              console.error('Unknown error during withdrawal process:', error.message);
          }
  
          // Provide a user-friendly error response
          throw new GraphQLError('Failed to process withdrawal. Please contact support if the issue persists.', {
              extensions: { code: 'WITHDRAWAL_ERROR', details: error.message },
          });
      }
  },

    createStripeAccountLink: async (_, { userId }, context) => {
        console.log("started creating stripe account link for user: ", userId);
      
        try {
          // Fetch the user from the database
          const user = await User.findById(userId);
          if (!user) {
            throw new GraphQLError('User not found', {
              extensions: { code: 'USER_NOT_FOUND' },
            });
          }
    
          
          const account = await stripe.accounts.create({
            type: 'custom', 
            email: user.username, 
            country: 'CA', 
            business_type: 'individual', 
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
          });
      
          console.log('Stripe account created:', account.id);  
          const updatedAccount = await stripe.accounts.retrieve(account.id);

          if (updatedAccount.requirements.currently_due.length > 0) {
            console.warn('Unmet requirements for account activation:', updatedAccount.requirements.currently_due);
          }

          user.stripeAccountId = account.id;
          user.isKycVerified = true ;
          await user.save();
      
          // Create a Stripe account link for onboarding
          const accountLink = await stripe.accountLinks.create({
            account: user.stripeAccountId,
            refresh_url: `${process.env.CLIENT_URL}/account`,
            return_url: `${process.env.CLIENT_URL}/account`,
            type: 'account_onboarding',
          });


          console.log("Stripe Account Link created successfully:", accountLink.url);
          return {
            success: true,
            url: accountLink.url,
            stripeAccountId: user.stripeAccountId,
          };
        } catch (error) {
          console.error('Error creating Stripe account link:', error.message);
          throw new GraphQLError('Failed to create Stripe account link', {
            extensions: { code: 'STRIPE_ACCOUNT_LINK_ERROR', details: error.message },
          });
        }
      },      
      
    // sellStock: async (_, { ticker, shares, stockPrice }, context) => {
    //   const { token } = context;

    //   const result = await verifyToken(token);

    //   if (result.error) {
    //     throw new GraphQLError(result.error, {
    //       extensions: {
    //         code: 'UNAUTHORIZED',
    //       },
    //     });
    //   }

    //   const user = await User.findById(result.userId);
    //   const totalAmount = shares * stockPrice;

    //   if (!user) {
    //     throw new GraphQLError('User not found', {
    //       extensions: { code: 'USER_NOT_FOUND' },
    //     });
    //   }

    //   const transaction = new Transaction({
    //     userId: user.id,
    //     type: 'Sell',
    //     ticker,
    //     shares,
    //     totalAmount,
    //     stockPrice,
    //   });

    //   user.balance += totalAmount;

    //   await Promise.all([transaction.save(), user.save()]);

    //   return {
    //     success: true,
    //     message: 'Stock sold successfully',
    //     newBalance: user.balance,
    //   };
    // },
  },
};
