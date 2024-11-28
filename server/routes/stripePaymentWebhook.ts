import { Request, Response } from 'express';
import stripe from '../utils/stripeInstance';
import { BankingTransaction } from '../models/Transaction';
import { User } from '../models/User';
import Stripe from 'stripe';

// Webhook Handler Function
const stripeWebhookHandler = async (req: Request, res: Response) => {
    console.log('Stripe webhook handler invoked');

    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        console.log('Event type is checkout.session.completed');

        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === 'paid' && session.metadata) {
            const { userId, amount } = session.metadata;

            try {
                const user = await User.findById(userId);
                if (!user) {
                    console.error('User not found for userId:', userId);
                    return res.status(404).send('User not found');
                }

                const transaction = new BankingTransaction({
                    userId,
                    type: 'Deposit',
                    totalAmount: parseFloat(amount),
                    paymentMethod: 'Stripe',
                    status: 'Completed',
                });

                user.balance += parseFloat(amount);

                await Promise.all([transaction.save(), user.save()]);
                console.log(`Deposit successful for user ${userId}. New balance: ${user.balance}`);
            } catch (error) {
                console.error('Error processing deposit:', error);
                return res.status(500).send('Internal server error');
            }
        } else {
            console.log('Payment status is not "paid" or metadata is missing');
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
    console.log('Response sent to Stripe');
};

export default stripeWebhookHandler;
