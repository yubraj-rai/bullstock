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
            html: `
              <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                          <h2 style="color: #333;">Your OTP Code</h2>
                          <p style="color: #555;">Dear User,</p>
                          <p style="color: #555;">To Proceed To Reset Your Password, please use the following OTP:</p>
                          <h3 style="color: #007BFF; font-weight: bold;">${otp}</h3>
                          <p style="color: #555;">This OTP is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
                          <footer style="margin-top: 20px; font-size: 0.8em; color: #999;">
                              <p>Thank you,<br>BullStocks</p>
                          </footer>
                      </div>
                  </body>
              </html>
          `,
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