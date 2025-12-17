import mysql from "mysql2/promise";

let pool; 
export const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
    process.exit(1);
  }
};

export const getPool = () => {
  if (!pool) throw new Error("Pool not initialized. Call connectDB() first.");
  return pool;
};
