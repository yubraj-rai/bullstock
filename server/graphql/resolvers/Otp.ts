import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';
import { validatePasswordInput } from '../../utils/AuthValidator';
import { GraphQLError } from 'graphql';

// Resolver functions
export const OtpResolver = {
    Mutation: {

    sendOtp: async (_: any, { username }: { username: string }) => {
        const user = await User.findOne({ username });
        console.log("username ::::",username);
        
        if (!user) throw new Error('No User Exist with Email');
        console.log("send user ::::", user);
        
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
        await user.save();
        
        // Send email
        const mailOptions = {
            from: 'hirakpatel0801@gmail.com',
            to: username,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        
        return 'OTP sent to email';
    },
    verifyOtp: async (_: any, { username, otp }: { username: string; otp: string }) => {
        const user = await User.findOne({ username });
        console.log("verify user ::::", user);

      if (!user) throw new Error('User not found');
      if (user.otp !== otp || Date.now() > user.otpExpiry.getTime()) throw new Error('Invalid or expired OTP');
  
      // Generate a JWT token after successful OTP verification
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
      return token;
    },
  
    resetPassword: async (_: any, { username, password , confirmPassword}: { username: string; password: string ; confirmPassword: string }) => {
      const { valid, errors } = validatePasswordInput(password, confirmPassword);
      if (!valid) {
          throw new GraphQLError(errors, {
              extensions: {
                  code: 'UNAUTHORIZED',
              },
          });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.updateOne({ username }, { password: hashedPassword, otp: null, otpExpiry: null });
      return 'Password reset successful';
    }
  },};
  
const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hirakpatel0801@gmail.com',
    pass: 'evyp jitz yfyz vvjo'
  }
});