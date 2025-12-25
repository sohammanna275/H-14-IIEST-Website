import express from "express";
import { getPool } from "../db/connect.js";

const router = express.Router();

// router.get("/", async (req, res) => {
//     try {
//         const pool = getPool();
//         const [results] = await pool.query("CALL GetStudentRoom()");
//         res.json(results[0]);

//     } catch (err) {
//         console.error("Error fetching rooms: ", err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//         })
//     }
// })

router.get("/", async (req, res) => {
    try {
        const pool = getPool();

        const [rows] = await pool.query(`
      SELECT 
        st.studentID,
        st.enrollmentNo,
        st.LastName,
        st.FirstName,
        sh.roomNo,
        sh.floorNo,
        sh.hostelRoomID
      FROM tblstudent st
      LEFT JOIN tblstudentroom sr
        ON st.studentID = sr.studentID
      LEFT JOIN tblhostelroom sh
        ON sr.hostelRoomID = sh.hostelRoomID
    `);

        res.json({
            success: true,
            data: rows,
        });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// router.get("/by-floor/:floor", async (req, res) => {
//     try {
//         const {floor} = req.params;
//         const pool = getPool();
//         const [results] = await pool.query(
//             "CALL GetRoomNo(?)", [floor]
//         )
//         res.json(results[0]);
//     } catch (err) {
//         console.error("Error fetching Room Numbers: ", err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//         })
//     }
// })

router.get("/by-floor/:floor", async (req, res) => {
    try {
        const floor = Number(req.params.floor);

        if (Number.isNaN(floor)) {
            return res.status(400).json({
                success: false,
                message: "Invalid floor number",
            });
        }

        const pool = getPool();
        const [rows] = await pool.query(
            `
      SELECT hostelRoomID, roomNo
      FROM tblhostelroom
      WHERE floorNo = ?
      `,
            [floor]
        );

        res.json({
            success: true,
            data: rows,
        });
    } catch (err) {
        console.error("Error fetching room numbers:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// router.post("/allocate", async (req, res) => {
//     try {
//         const allocations = req.body; // expect array: [{studentID, floorID, roomID}, ...]
//         if (!Array.isArray(allocations) || allocations.length === 0) {
//             return res.status(400).json({ success: false, error: "Invalid allocations array" });
//         }
//         const pool = getPool();
//         const allocationsJSON = JSON.stringify(allocations);
//         const [results] = await pool.query("CALL StudentAllocateRoom(?)", [allocationsJSON]);
//         res.json({success: true, message: "Rooms Allocated Successfully "});
//     } catch (err) {
//         console.error("Error while allocating room: ", err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//         });
//     }
// });

router.post("/allocate", async (req, res) => {
    const connection = await getPool().getConnection();

    try {
        const allocations = req.body;

        if (!Array.isArray(allocations) || allocations.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocations array",
            });
        }

        await connection.beginTransaction();

        for (const alloc of allocations) {
            const studentID = Number(alloc.studentID);
            const floorID = Number(alloc.floorID);
            const roomID = Number(alloc.roomID);

            if (!studentID || !floorID || !roomID) {
                throw new Error("studentID, floorID and roomID are required and must be numbers");
            }
            console.log("Allocating:", { studentID, floorID, roomID });
            // 1️ Get hostelRoomID
            const [rooms] = await connection.query(
                `
        SELECT hostelRoomID
        FROM tblhostelroom
        WHERE floorNo = ? AND roomNo = ?
        LIMIT 1
        `,
                [floorID, roomID]
            );

            if (rooms.length === 0) {
                throw new Error(`Room ${roomID} on floor ${floorID} not found`);
            }

            const hostelRoomID = rooms[0].hostelRoomID;

            // 2️ Check existing allocation
            const [existing] = await connection.query(
                "SELECT 1 FROM tblstudentroom WHERE studentID = ?",
                [studentID]
            );

            if (existing.length > 0) {
                // Update
                await connection.query(
                    `
          UPDATE tblstudentroom
          SET hostelRoomID = ?
          WHERE studentID = ?
          `,
                    [hostelRoomID, studentID]
                );
            } else {
                // Insert
                await connection.query(
                    `
          INSERT INTO tblstudentroom (studentID, hostelRoomID)
          VALUES (?, ?)
          `,
                    [studentID, hostelRoomID]
                );
            }
        }

        await connection.commit();

        res.json({
            success: true,
            message: "Rooms allocated successfully",
        });
    } catch (err) {
        await connection.rollback();
        console.error("Error while allocating rooms:", err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    } finally {
        connection.release();
    }
});


export default router;