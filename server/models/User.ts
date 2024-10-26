import mongoose, { Schema } from 'mongoose';

// Mongoose User Schema definition
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    balance: {
        type: Number,
        default: 500,
        min: 0,
    },
    googleId: {
        type: String,
        default: false,
    },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false }
});

// Export the Mongoose model for the User schema
export const User = mongoose.model('User', UserSchema);
