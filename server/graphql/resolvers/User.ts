import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import { validateLoginInput, validateRegisterInput } from '../../utils/AuthValidator';
import {verifyGoogleToken} from '../../utils/googleAuth' ;
import { verifyToken } from '../../middleware/auth';

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
            const { valid, errors } = validateRegisterInput(username, password, confirmPassword);
     
            if (!valid) {
              throw new GraphQLError(errors, {
                extensions: {
                  code: 'UNAUTHORIZED',
                },
              });
            }
      
            const user = await User.findOne({ username });
      
            if (user) {
              throw new GraphQLError('Email is already taken', {
                extensions: {
                  code: 'TAKEN',
                },
              });
            }
      
            password = await bcrypt.hash(password, 12);
      
            const newUser = new User({
              username,
              password,
            });
      
            const result = await newUser.save();
            const token = generateToken(result);
      
            return { user: result, token };
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
        
            // Log additional details for debugging
            console.log('User logged in successfully:', {
                username: user.username,
                stripeAccountId: user.stripeAccountId,
            });
        
            // Ensure full user details are returned
            const completeUser = await User.findById(user._id); // Re-fetch full user details
        
            return { user: completeUser, token };
         },
        
        googleLogin: async (_, { googleToken }) => {
            try {
                const { email, name } = await verifyGoogleToken(googleToken);
                let user = await User.findOne({ username: email });
        
                if (!user) {
                    user = new User({
                        username: email,
                        googleId: googleToken,
                        isVerified: true,
                        balance: 0, // Initialize balance if new user
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    await user.save();
        
                    // Log user creation
                    console.log('New user created via Google login:', {
                        username: email,
                        googleId: googleToken,
                    });
                }
        
                const token = generateToken(user);
        
                // Re-fetch full user details
                const completeUser = await User.findById(user._id);
        
                // Log additional details for debugging
                console.log('Google login successful:', {
                    username: completeUser.username,
                    stripeAccountId: completeUser.stripeAccountId,
                });
        
                return { user: completeUser, token };
            } catch (error) {
                console.error('Google login error:', error.message);
                throw new GraphQLError('Google login failed', {
                    extensions: { code: 'GOOGLE_LOGIN_ERROR', details: error.message },
                });
            }
        },
    },

    Query: {
        getUser: async (_, args, context) => {
            const { token } = context;
        
            // Verify the token to authenticate the user
            const result = await verifyToken(token);
            if (result.error) {
                throw new GraphQLError(result.error, {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }
        
            // Fetch the user from the database
            const user = await User.findById(result.userId);
            if (!user) {
                throw new GraphQLError('User not found', {
                    extensions: { code: 'USER_NOT_FOUND' },
                });
            }
        
            // Return the user along with a token
            return {
                user: {
                    _id: user._id,
                    username: user.username,
                    balance: user.balance,
                    stripeAccountId: user.stripeAccountId,
                    isKycVerified: user.isKycVerified,
                },
                token: token, // Return the same token
            };
        },
        
    },
};