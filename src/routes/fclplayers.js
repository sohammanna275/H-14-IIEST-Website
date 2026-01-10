import express from "express";
import { getPool } from "../db/connect.js";

const router = express.Router();

// Get all players
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM tblPlayer");

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Add a new player
router.post("/", async (req, res) => {
  const { playerName, deptID, playerEmail, phoneNo, jerseyNo, jerseySize, playRole } = req.body;

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO tblPlayer (playerName, deptID, playerEmail, phoneNo, jerseyNo, jerseySize, playRole)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [playerName, deptID, playerEmail, phoneNo, jerseyNo, jerseySize, playRole]
    );

    res.json({
      success: true,
      message: "Player Registration successfull!",
    });
  } catch (err) {
    console.error("Error adding player:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
