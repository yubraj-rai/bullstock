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
        //console.log('Raw Authorization header received:', token);
        const parts = token.split(' ');

        // If the token doesn't have two parts or doesn't start with 'Bearer', it's malformed
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            console.log('Malformed token format. Expected "Bearer <token>"', parts);
            return { error: 'Malformed token. Please log in again.' };
        }

        const bearerToken = parts[1];
        const isCustomAuth = bearerToken.length < 500; // Assuming custom JWTs are smaller than OAuth tokens
        let contentDecoded: string | jwt.JwtPayload | null;
        let userId: string | undefined;

        // If it's a custom JWT, verify it using the server's secret
        if (bearerToken && isCustomAuth) {
            contentDecoded = jwt.verify(bearerToken, jwtSecret as string);
            userId = (contentDecoded as jwt.JwtPayload).id;
        } else {
            // If it's an OAuth token, decode without verifying the signature
            contentDecoded = jwt.decode(bearerToken);
            userId = (contentDecoded as jwt.JwtPayload)?.sub;
        }

        // Resolve the promise with an error message if the userId is not present
        if (!userId) {
            console.error('Token is missing user ID:', bearerToken);
            return { error: 'Invalid token. User not found.' };
        }

        // Return the userId if everything is valid
        return { userId };
    } catch (error) {
        // Log error details for debugging
        console.error('Error during token verification:', error.message);
        return { error: 'Token verification failed. Please log in again.' };
    }
};
