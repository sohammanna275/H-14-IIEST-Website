import express from "express";
import { getPool } from "../db/connect.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = getPool();
        const [results] = await pool.query("CALL GetStudentRoom()");
        res.json(results[0]);
        
    } catch (err) {
        console.error("Error fetching rooms: ", err);
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
})

router.get("/by-floor/:floor", async (req, res) => {
    try {
        const {floor} = req.params;
        const pool = getPool();
        const [results] = await pool.query(
            "CALL GetRoomNo(?)", [floor]
        )
        res.json(results[0]);
    } catch (err) {
        console.error("Error fetching Room Numbers: ", err);
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
})

router.post("/allocate", async (req, res) => {
    try {
        const allocations = req.body; // expect array: [{studentID, floorID, roomID}, ...]
        if (!Array.isArray(allocations) || allocations.length === 0) {
            return res.status(400).json({ success: false, error: "Invalid allocations array" });
        }
        const pool = getPool();
        const allocationsJSON = JSON.stringify(allocations);
        const [results] = await pool.query("CALL StudentAllocateRoom(?)", [allocationsJSON]);
        res.json({success: true, message: "Rooms Allocated Successfully "});
    } catch (err) {
        console.error("Error while allocating room: ", err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

export default router;