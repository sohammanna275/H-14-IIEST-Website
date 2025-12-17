import express from "express"
import { getPool } from "../db/connect.js"
import { json } from "sequelize";
const router = express.Router();

router.get("/", async(req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query("CALL GetDeptList()");
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching departments: ", err);
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
});
export default router;

