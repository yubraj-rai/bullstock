import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token');
    }

    const email = payload.email;
    const name = payload.name;

    return { email, name };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Failed to verify Google token');
  }
};
