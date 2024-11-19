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
    checkStripeAccountRequirements: async (_, { stripeAccountId }) => {
        try {
          const account = await stripe.accounts.retrieve(stripeAccountId);
          console.log('checkStripeAccountRequirements:', account);
          console.log('account.requirements.currently_due:', account.requirements.currently_due);
          return {
            success: true,
            requirements: account.requirements.currently_due || [],
          };
        } catch (err) {
          console.error('Error retrieving Stripe account requirements:', err.message);
          throw new GraphQLError('Failed to retrieve account requirements', {
            extensions: { code: 'REQUIREMENTS_CHECK_ERROR', details: err.message },
          });
        }
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
        console.log("===================Verification started for userId:", userId, "sessionId:", sessionId);
    
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
      
        console.log("===========withdraw================");
      
        // Authenticate the user using the provided token
        const result = await verifyToken(token);
        if (result.error) {
          throw new GraphQLError(result.error, {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          });
        }
      
        console.log("===========withdraw===============2=", result.userId);
      
        // Retrieve the user from the database
        const user = await User.findById(result.userId);
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' },
          });
        }
            
        console.log('User Stripe Account ID:', user.stripeAccountId);
      
        // Validate the withdrawal amount
        if (amount <= 0) {
          throw new GraphQLError('Invalid withdrawal amount. Must be greater than 0.', {
            extensions: { code: 'INVALID_AMOUNT' },
          });
        }
      
        console.log("===========withdraw==============5==");
      
        // Check if the user has sufficient funds
        if (user.balance < amount) {
          throw new GraphQLError('Insufficient funds', {
            extensions: { code: 'INSUFFICIENT_FUNDS' },
          });
        }

        const account = await stripe.accounts.retrieve('acct_1QLf6TQ0oB5ILoAp');
        console.log('Connected Account Capabilities:', account.capabilities);
        console.log('Unmet Requirements:', account.requirements.currently_due);
            
        try {
          // Create a Stripe transfer to the user's connected account   
          console.log("===========withdraw ammount: ", Math.round(amount * 100));       
          const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100), // Convert amount to cents
            currency: 'cad',
            destination: user.stripeAccountId, // Linked Stripe account ID
          });
      
          console.log("===========withdraw successfull==============7==", transfer.id);

          const payout = await stripe.payouts.create(
            {
              amount: Math.round(amount * 100), // Amount in cents (e.g., $50.00)
              currency: 'cad',
            },
            {
              stripeAccount: user.stripeAccountId, // Connected account ID
            }
          );
          console.log('Payout :', payout);
          console.log('Payout initiated:', payout.id);

          const payoutDetails = await stripe.payouts.retrieve(payout.id, {
            stripeAccount: user.stripeAccountId, // Connected account ID
          });
          
          console.log('Payout details:', payoutDetails);
          
          
      
          // Deduct balance and create a transaction record
          const transaction = new BankingTransaction({
            userId: user.id,
            type: 'Withdrawal',
            totalAmount: amount,
            paymentMethod: 'Stripe',
            status: 'Completed',
            stripeTransferId: transfer.id, // Log Stripe transfer ID for traceability
          });
      
          user.balance -= amount;
      
          // Save both the user balance update and the transaction record
          await Promise.all([transaction.save(), user.save()]);
      
          return {
            success: true,
            message: 'Withdrawal successful',
            newBalance: user.balance,
          };
        } catch (error) {
          console.error('Error processing withdrawal:', error.message, error.stack);
          throw new GraphQLError('Failed to process withdrawal. Please contact support if the issue persists.', {
            extensions: { code: 'WITHDRAWAL_ERROR' },
          });
        }
    },
    createStripeAccountLink: async (_, { userId }, context) => {
        console.log("Mutation Hit: createStripeAccountLink");
        console.log("User ID:", userId);
      
        try {
          // Fetch the user from the database
          const user = await User.findById(userId);
          if (!user) {
            throw new GraphQLError('User not found', {
              extensions: { code: 'USER_NOT_FOUND' },
            });
          }
      
          // console.log("======stripe.accounts.create===========", user.username);
          // const account = await stripe.accounts.create({
          //   type: 'custom',
          //   email: user.username, // Use user's email from the database
          //   business_type: 'individual', // Individual account
          // });
          
          const account = await stripe.accounts.create({
            type: 'custom', // Custom account type
            email: user.username, // Use user's email from the database
            country: 'CA', // Set the country to Canada (CA) or adjust as needed
            business_type: 'individual', // Individual account type
            capabilities: {
              card_payments: {
                requested: true, // Enable card payments capability
              },
              transfers: {
                requested: true, // Enable transfers capability
              },
            },
          });
      
          // Log the created account details
          console.log('Stripe account created:', account.id);  
          // Verify the account capabilities after creation
          const updatedAccount = await stripe.accounts.retrieve(account.id);
          console.log('Account capabilities:', updatedAccount.capabilities);

          
          if (updatedAccount.requirements.currently_due.length > 0) {
            console.warn('Unmet requirements for account activation:', updatedAccount.requirements.currently_due);
          }


          user.stripeAccountId = account.id;
          await user.save();
      
          // Create a Stripe account link for onboarding
          const accountLink = await stripe.accountLinks.create({
            account: user.stripeAccountId,
            refresh_url: `${process.env.CLIENT_URL}/onboard/refresh`,
            return_url: `${process.env.CLIENT_URL}/onboard/success`,
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
