import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const UserResolver = {
    Mutation: {
        registerUser: async (_, { username, password, confirmPassword }) => {
            // Placeholder resolver for registering a user
            return null; // Returning null as a placeholder
        },
        loginUser: async (_, { username, password }) => {
            // Placeholder resolver for logging in a user
            return null; // Returning null as a placeholder
        },
        deposit: async (_, { amount }, context) => {
            // Placeholder resolver for deposit operation
            return null; // Returning null as a placeholder
        },
        withdraw: async (_, { amount }, context) => {
            // Placeholder resolver for withdraw operation
            return null; // Returning null as a placeholder
        },
        changeUsername: async (_, { newUsername, confirmPassword }, context) => {
            // Placeholder resolver for changing username
            return null; // Returning null as a placeholder
        },
    },

    Query: {
        getUser: async (_, args, context) => {
            // Placeholder resolver for fetching a user
            return null; // Returning null as a placeholder
        },
    },
};
