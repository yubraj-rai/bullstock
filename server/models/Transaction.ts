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
        default: () => Date.now(),
    },
    paymentMethod: {
        type: String,
        required: false,
    },
});

const BankingTransactionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);
export const BankingTransaction = mongoose.model('BankingTransaction', BankingTransactionSchema );
