import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

interface Response {
    error?: string;
    userId?: string;
}

export const verifyToken = async (token: string): Promise<Response> => {
    try {
        // Extract the token part from the "Bearer <token>" string
        const bearerToken = token.split(' ')[1];
        const isCustomAuth = bearerToken.length < 500;
        let contentDecoded: string | jwt.JwtPayload | null;
        let userId: string | undefined;

        if (bearerToken && isCustomAuth) {
            // If it's a custom JWT, verify the token using the server's secret
            contentDecoded = jwt.verify(bearerToken, jwtSecret as string);
            userId = (contentDecoded as jwt.JwtPayload).id;
        } else {
            // If it's an OAuth token, decode it without verifying the signature
            contentDecoded = jwt.decode(bearerToken);
            userId = (contentDecoded as jwt.JwtPayload)?.sub;
        }

        // Resolve the promise with an error message if the userId is not present
        if (!userId) {
            return { error: 'Invalid Token' };
        }

        // Resolve the promise with the extracted userId
        return { userId };
    } catch (error) {
        // Return an error message if any exception occurs during token processing
        return { error: 'Token verification failed. Please log in again.' };
    }
};
