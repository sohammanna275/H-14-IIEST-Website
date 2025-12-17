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
    await pool.query(
        "CALL SaveLeaveRegister(?, ?, ?, ?, ?)",
        [0, studentID, startDate, endDate, reason]
    );
      res.status(201).json({
    success: true,
    message: "Leave applied successfully",
  });
});

export { applyLeave };

