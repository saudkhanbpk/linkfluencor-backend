import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const sendActivationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: 'Linkfluencer Account Activation',
    text: `Please click the following link to activate your account: ${config.appUrl}/activate/${token}`,
  };

  await transporter.sendMail(mailOptions);
};
