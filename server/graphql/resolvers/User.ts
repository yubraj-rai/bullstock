import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import { validateLoginInput, validateRegisterInput } from '../../utils/AuthValidator';
import {verifyGoogleToken} from '../../utils/googleAuth' ;

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
      
            console.log(username) ;
            console.log(password) ;
            console.log(confirmPassword) ;
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

            return { user, token };
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
                    });
                    await user.save();
                }
        
                const token = generateToken(user);
                return { user, token };
            } catch (error) {
                console.error("Google login error:", error);
                return null;
            }
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