import mongoose, { Schema } from 'mongoose';

// Mongoose Transaction Schema definition
const TransactionSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    ticker: {
        type: String,
        required: true,
    },
    shares: {
        type: Number,
        required: true,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stockPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        required: false,
    },
});

// Export the Mongoose model for the Transaction schema
export const Transaction = mongoose.model('Transaction', TransactionSchema);
