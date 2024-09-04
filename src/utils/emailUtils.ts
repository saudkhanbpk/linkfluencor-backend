import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { UserStatus } from '../types/enums';

export const handleEmailNotifications = async (
  email: string,
  status: UserStatus,
  activationToken?: string
) => {
  if (status === UserStatus.Active) {
    await sendWelcomeEmail(email);
  } else if (status === UserStatus.Pending && activationToken) {
    await sendActivationEmail(email, activationToken);
  }
};

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

export const sendWelcomeEmail = async (email: string) => {
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
    subject: 'Welcome to Linkfluencer!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <div style="background-color: #1C3643; padding: 20px; text-align: center; color: white;">
          <h1>Linkfluencer</h1>
        </div>
        <div style="background-color: #A3E2AD; padding: 40px; text-align: center;">
          <h2>Now that you’ve created Smart Links, it’s time to see how they’re performing!</h2>
          <a href="#" style="background-color: #0A2742; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Linkfluencer</a>
        </div>
        <div style="padding: 20px; text-align: center;">
          <h3>Track Your Performance</h3>
          <p>Linkfluencer.io provides detailed analytics on how your links are doing. See which links are driving the most traffic and where your audience is coming from.</p>
          <h3>Optimize Your Links</h3>
          <p>Use the insights from our analytics to tweak your links, ensuring maximum engagement. Whether you’re linking to Instagram, TikTok, Amazon, Twitch or Youtube or any other supported platform, you’ll know exactly what works best.</p>
        </div>
        <div style="background-color: #A3E2AD; padding: 40px; text-align: center;">
          <h3>What’s Next?</h3>
          <p>Keep refining your Smart Links to stay ahead in the game.</p>
          <a href="#" style="background-color: #0A2742; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Check Your Analytics Now</a>
        </div>
        <div style="background-color: #1C3643; padding: 20px; text-align: center; color: white;">
          <p>© 2024 Linkfluencer</p>
          <div>
            <a href="https://facebook.com" style="color: white; margin: 0 10px;">Facebook</a>
            <a href="https://linkedin.com" style="color: white; margin: 0 10px;">LinkedIn</a>
            <a href="https://instagram.com" style="color: white; margin: 0 10px;">Instagram</a>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
