import mongoose, { Schema } from 'mongoose';

// Mongoose User Schema definition
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
	required: function () {
           return !this.googleId;
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    balance: {
        type: Number,
        default: 500,
        min: 0,
    },
    googleId: {
        type: String,
        sparse: true,  // This will allow `null` values for `googleId`
    },
    otp: { 
        type: String, 
        required: false 
    },
    otpExpiry: { 
        type: Date, 
        required: false 
    },
    stripeAccountId: {
        type: String,
        required: false,
    },
    isKycVerified: {
        type: Boolean,
        default: false,
        required:false,
    },
});

// Export the Mongoose model for the User schema
export const User = mongoose.model('User', UserSchema);
