import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" }); // load env variables

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME,       // database name
  process.env.DB_USER,       // database user
  process.env.DB_PASSWORD,   // database password
  {
    host: process.env.DB_HOST, // host, usually localhost
    dialect: "mysql",          // since we are using MySQL
    logging: false,            // set true if you want to see SQL queries
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected to MySQL successfully!");
  } catch (err) {
    console.error("❌ Sequelize connection error:", err);
    process.exit(1);
  }
};
