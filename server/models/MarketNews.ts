// models/MarketNews.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketNews extends Document {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    publishedAt: Date;
    createdAt: Date;
}

const MarketNewsSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        url: { type: String, required: true },
        imageUrl: { type: String },
        publishedAt: { type: Date, required: true },
    },
    { timestamps: true }
);

export const MarketNews = mongoose.model<IMarketNews>('MarketNews', MarketNewsSchema);
