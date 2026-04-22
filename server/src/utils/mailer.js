import nodemailer from "nodemailer";
import env from "../config/env.js";
import { AppError } from "./error.js";

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!env.smtpUser || !env.smtpPassword || !env.smtpHost || !env.smtpPort) {
    throw new AppError("Email OTP service is not configured", 500, "SERVER_ERROR");
  }

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },
  });

  return transporter;
};

export const sendOtpEmail = async ({ to, otp }) => {
  const client = getTransporter();

  await client.sendMail({
    from: env.smtpFrom || env.smtpUser,
    to,
    subject: "Your Productr OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
  });
};
