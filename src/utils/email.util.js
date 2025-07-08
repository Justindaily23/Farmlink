import nodemailer from 'nodemailer';
import { getEnvironmentVariable } from '../config/dotenvConfig.js'; // if you use env vars

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525, // or 587
    auth: {
      user: getEnvironmentVariable('MAILTRAP_USER'), // set in your .env file
      pass: getEnvironmentVariable('MAILTRAP_PASS'), // set in your .env file
    },
  });

  await transporter.sendMail({
    from: `"FarmLink Dev" <no-reply@farmlink.dev>`, // your "from" address
    to,
    subject,
    text,
  });
};
