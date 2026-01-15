import express from "express";
import { getPool } from "../db/connect.js";
import { protect } from "../middlewares/auth.js";
import { io } from "../index.js";
const router = express.Router();
// getting the score
router.get("/matches", async (req, res) => {
    try {
        const pool = getPool();
        const [matches] = await pool.query(`
            SELECT m.matchID, m.status, m.startTime,
                d1.deptName AS teamAName,
                d2.deptName AS teamBName,
                s.scoreA, s.scoreB, s.wicketsA, s.wicketsB, s.overs
            FROM matches m 
            JOIN fclTblDept d1 on m.teamA =  d1.deptID
            JOIN fclTblDept d2 on m.teamB  = d2.deptID
            LEFT JOIN matchScore s ON m.matchID = s.matchID
            `);
        res.json({
            success: true,
            data: matches,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})
// update the score
// router.post("/update-score", protect(["admin", "staff"]), async(req, res) => {
//     const {matchID, scoreA, scoreB, wicketsA, wicketsB, overs} = req.body;
//     try{
//         const pool = getPool();
//         await pool.query(
//             `INSERT INTO matchScore(matchID, scoreA, scoreB, wicketsA, wicketsB, overs)
//             VALUES (?, ?, ?, ?, ?, ?)
//             ON DUPLICATE KEY UPDATE
//                 scoreA = VALUES(scoreA),
//                 scoreB = VALUES(scoreB),
//                 wicketsA = VALUES(wicketsA),
//                 wicketsB = VALUES(wicketsB),
//                 overs = VALUES(overs)
//             `, [matchID, scoreA, scoreB, wicketsA, wicketsB, overs]
//         );
//         // Emitting realtime event to clients
//     io.to(`match_${matchID}`).emit("score_update", { matchID, scoreA, scoreB, wicketsA, wicketsB, overs });
//     res.json({ success: true });
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// });
router.post("/update-score", async (req, res) => {
  const { matchID, scoreA, scoreB, wicketsA, wicketsB, overs } = req.body;

  if (!matchID) {
    return res.status(400).json({
      success: false,
      message: "matchID is required"
    });
  }

  try {
    const pool = getPool();

    await pool.query(
      `INSERT INTO matchScore (matchID, scoreA, scoreB, wicketsA, wicketsB, overs)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         scoreA = VALUES(scoreA),
         scoreB = VALUES(scoreB),
         wicketsA = VALUES(wicketsA),
         wicketsB = VALUES(wicketsB),
         overs = VALUES(overs)
      `,
      [matchID, scoreA, scoreB, wicketsA, wicketsB, overs]
    );

    await pool.query(
      `UPDATE matches SET status='live' WHERE matchID=?`,
      [matchID]
    );

    io.to(`match_${matchID}`).emit("score_update", {
      matchID,
      scoreA,
      scoreB,
      wicketsA,
      wicketsB,
      overs,
      updatedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// add match
router.post("/add-match", async (req, res) => {
  const { teamA, teamB, startTime } = req.body;

  if (!teamA || !teamB) {
    return res.status(400).json({
      success: false,
      message: "Both teams are required"
    });
  }

  if (teamA === teamB) {
    return res.status(400).json({
      success: false,
      message: "Team A and Team B cannot be the same"
    });
  }

  try {
    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO matches (teamA, teamB, status, startTime)
       VALUES (?, ?, 'upcoming', ?)`,
      [teamA, teamB, startTime || new Date()]
    );

    res.json({
      success: true,
      matchID: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


export default router;
