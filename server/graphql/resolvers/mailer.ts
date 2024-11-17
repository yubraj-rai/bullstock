const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any service (Gmail, SendGrid, etc.)
    auth: {
        user: 'hirakpatel0801@gmail.com',
        pass: 'evyp jitz yfyz vvjo'
      },
});

// Send email function
const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: 'hirakpatel0801@gmail.com',
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
