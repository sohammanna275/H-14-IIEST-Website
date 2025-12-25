// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" }); 
// console.log("ENV CHECK:", {
//   EMAIL_HOST: process.env.EMAIL_HOST,
//   EMAIL_PORT: process.env.EMAIL_PORT,
//   EMAIL_USER: process.env.EMAIL_USER
// });
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "undefined");
// console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "missing");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import { connectDB } from "./db/connect.js";
import { testConnection } from "./db/sequelize.js";
const port = process.env.PORT || 8000;
testConnection();
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
    process.exit(1);
  });
