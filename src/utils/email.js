import dotenv from "dotenv";
import path from "path";

import nodemailer from "nodemailer";
import Mailgen from "mailgen";
dotenv.config({ path: path.resolve(process.cwd(), "./.env") });
// Nodemailer transporter using Gmail service
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,   // Gmail sender
//     pass: process.env.EMAIL_PASS,   // App Password
//   },
// });
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",   // Gmail SMTP host
//   port: 465,                // TLS/STARTTLS
//   secure: true,            // false for TLS
//   auth: {
//     user: process.env.EMAIL_USER,  // Gmail sender
//     pass: process.env.EMAIL_PASS,  // App Password
//   },
// });

console.log("Nodemailer auth:", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "loaded" : "missing",
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
});

// Mailgen config
const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
        name: "Hostel-14 Management System",
        link: process.env.APP_URL || "http://localhost:5173",
    },
});

// Function to send email
export const sendEmail = async (to, subject, resetLink) => {
    const email = {
        body: {
            name: "User",
            intro: "You requested a password reset for your Hostel-14 account.",
            action: {
                instructions:
                    "Click the button below to reset your password. This link will expire in 15 minutes.",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: resetLink,
                },
            },
            outro: "If you did not request this, you can safely ignore this email.",
        },
    };
    const emailBody = mailGenerator.generate(email)

    await transporter.sendMail({
        from: `"Hostel-14" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: emailBody,
    });
};
