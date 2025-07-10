import nodemailer from 'nodemailer';
import { getEnvironmentVariable } from '../config/dotenvConfig.js'; // if you use env vars

// Setting Email utility using nodemailer
export const sendEmail = async (
  to,
  subject,
  htmlContent,
  plainTextFallback = ''
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: getEnvironmentVariable('MAIL_USER'),
      pass: getEnvironmentVariable('MAIL_PASS'),
    },
  });

  await transporter.sendMail({
    from: `"FarmLink Support" <${getEnvironmentVariable('MAIL_USER')}>`,
    to,
    subject,
    html: htmlContent,
    text: plainTextFallback,
  });
};
