import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import { validateLoginInput } from '../../utils/AuthValidator';
import { verifyGoogleToken } from '../../utils/googleAuth';

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
            const { valid, errors } = validateLoginInput(username, password);

            if (!valid) {
                throw new GraphQLError(errors, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            const user = await User.findOne({ username });

            if (!user) {
                throw new GraphQLError('Incorrect username or password', {
                    extensions: {
                        code: 'BAD_INPUT',
                    },
                });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new GraphQLError('Incorrect username or password', {
                    extensions: {
                        code: 'BAD_INPUT',
                    },
                });
            }

            const token = generateToken(user);

            return { user, token };
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
        googleLogin: async (_, { googleToken }) => {
            try {
              const { email, name } = await verifyGoogleToken(googleToken);
      
              // Check if the user already exists
              let user = await User.findOne({ username: email });
      
              if (!user) {
                // If the user doesn't exist, create a new one
                user = await User.create({ username: email, password: 'google-oauth', balance: 500 });
              }
      
              // Generate a JWT for the user
              const token = generateToken(user);
      
              return { user, token };
            } catch (error) {
              throw new GraphQLError('Google authentication failed', {
                extensions: {
                  code: 'UNAUTHORIZED',
                },
              });
            }
          },
    },

    Query: {
        getUser: async (_, args, context) => {
            // Placeholder resolver for fetching a user
            return null; // Returning null as a placeholder
        },
    },
};
