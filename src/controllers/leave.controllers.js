import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getPool } from "../db/connect.js";

const applyLeave = asyncHandler(async (req, res) => {
    const { startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) {
        throw new ApiError(400, "All fields are required ");
    }
    if (new Date(startDate) > new Date(endDate)) {
        throw new ApiError(400, "End date must be after start date");
    }
    const userID = req.user.id // from jwt
    const pool = getPool();
    const [students] = await pool.query(
        "SELECT studentID FROM tblstudent WHERE userID = ?", [userID]
    );
    if (students.length === 0) {
        throw new ApiError(404, "Student record not found");
    }
    const studentID = students[0].studentID;
    // await pool.query(
    //     "CALL SaveLeaveRegister(?, ?, ?, ?, ?)",
    //     [0, studentID, startDate, endDate, reason]
    // );
    await pool.query(
        "INSERT INTO leaveregister (studentID, startDate, endDate, reason) VALUES (?, ?, ?, ?)",
        [studentID, startDate, endDate, reason]
    );
    res.status(201).json({
        success: true,
        message: "Leave applied successfully",
    });
});

const getAllLeaves = asyncHandler(async (req, res) => {
    const pool = getPool();

    const [rows] = await pool.query(`
  SELECT 
    lr.leaveID,
    s.FirstName,
    s.LastName,
    lr.startDate,
    lr.endDate,
    lr.reason,
    lr.approvedBy,
    lr.approvedOn,
    CASE 
      WHEN lr.approvedBy IS NOT NULL THEN 'Approved'
      ELSE 'Pending'
    END AS status
  FROM leaveregister lr
  JOIN tblstudent s ON s.studentID = lr.studentID
  ORDER BY lr.startDate DESC
`);

    res.status(200).json({
        success: true,
        data: rows,
    });
});
const approveLeave = asyncHandler(async (req, res) => {
    const { leaveID } = req.params;
    const adminName = "admin"; // from JWT

    const pool = getPool();

    const [result] = await pool.query(
        `
    UPDATE leaveregister
    SET approvedBy = ?, approvedOn = NOW()
    WHERE leaveID = ? AND approvedBy IS NULL
    `,
        [adminName, leaveID]
    );

    if (result.affectedRows === 0) {
        throw new ApiError(400, "Leave already approved or not found");
    }
    const [updatedLeave] = await pool.query(
        "SELECT * FROM leaveregister WHERE leaveID = ?",
        [leaveID]
    );
    res.status(200).json({
        success: true,
        message: "Leave approved successfully",
        leave: updatedLeave[0]
    });
});

const getMyLeaves = asyncHandler(async (req, res) => {
    const userID = req.user.id; // from JWT
    const pool = getPool();

    // Find the student's ID
    const [students] = await pool.query(
        "SELECT studentID, FirstName, LastName FROM tblstudent WHERE userID = ?",
        [userID]
    );
    if (students.length === 0) {
        throw new ApiError(404, "Student record not found");
    }
    const studentID = students[0].studentID;

    // Fetch leaves for this student
    const [leaves] = await pool.query(`
        SELECT 
            lr.leaveID,
            lr.startDate,
            lr.endDate,
            lr.reason,
            lr.approvedBy,
            lr.approvedOn,
            CASE 
                WHEN lr.approvedBy IS NOT NULL THEN 'Approved'
                ELSE 'Pending'
            END AS status
        FROM leaveregister lr
        WHERE lr.studentID = ?
        ORDER BY lr.startDate DESC
    `, [studentID]);

    res.status(200).json({
        success: true,
        data: leaves,
    });
});



export { applyLeave, getAllLeaves, approveLeave, getMyLeaves };

