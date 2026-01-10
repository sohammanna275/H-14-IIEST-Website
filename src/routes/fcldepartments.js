import express from "express";
import { getPool } from "../db/connect.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM fclTblDept");

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
