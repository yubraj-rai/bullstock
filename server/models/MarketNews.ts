import mongoose, { Schema } from 'mongoose';

// Mongoose MarketNews Schema definition
const MarketNewsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

// Export the Mongoose model for the MarketNews schema
export const MarketNews = mongoose.model('MarketNews', MarketNewsSchema);
