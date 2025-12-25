import dotenv from "dotenv";
import path from "path";
import Mailgen from "mailgen";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config({ path: path.resolve(process.cwd(), "./.env") });

// Mailgen config (keep your existing setup)
const mailGenerator = new Mailgen({
  theme: "salted",
  product: {
    name: "Hostel-14 Management System",
    link: process.env.APP_URL,
  },
});

// Brevo client setup
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // ← use your Brevo API key

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Send email function
export const sendEmail = async (to, subject, resetLink) => {
  try {
    // Build email content using Mailgen
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

    const emailBody = mailGenerator.generate(email);

    // Send email via Brevo
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Hostel-14", email: "hostel14.staff@gmail.com" }; // must be verified in Brevo
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = emailBody;

    const info = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log("📧 Email sent via Brevo:", info);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err; // important for your controller to catch
  }
};
