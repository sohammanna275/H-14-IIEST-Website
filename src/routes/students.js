// import express from "express";
// import { getPool } from "../db/connect.js";

// const router = express.Router();

// router.put("/:id", async (req, res) => {
//     try {
//         const studentID = Number(req.params.id);
//         const {
//             LastName,
//             FirstName,
//             MiddleName,
//             DOB,
//             mobileNo,
//             gender,
//             guardianContactNo = null,
//             enrollmentNo,
//             isVegeterian,
//             medicalCondition,
//             deptNo = null,

//         } = req.body;
//         const pool = getPool();
//         await pool.query(
//             `CALL SaveStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 studentID,
//                 LastName,
//                 FirstName,
//                 MiddleName,
//                 DOB,
//                 mobileNo,
//                 gender,
//                 guardianContactNo,
//                 enrollmentNo,
//                 isVegeterian,
//                 medicalCondition,
//                 deptNo,
//             ]
//         );
//         res.json({success: true});
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({success : false, error: err.message});
//     }
// });

// export default router;

// routes/students.js
import express from "express";
import { getPool } from "../db/connect.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// -----------------------------
// 1️ GET all students - admin/staff only
// -----------------------------
router.get("/", protect(["admin", "staff"]), async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query("SELECT * FROM tblstudent");
        res.json({
            success: true,
            data: rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// -----------------------------
// 2️ GET single student profile
//    - student can access their own
//    - admin/staff can access any
// -----------------------------
router.get("/:id", protect(["admin", "staff"]), async (req, res) => {
    try {
        const studentID = Number(req.params.id);

        // // Student can only access their own profile
        // if (req.user.role === "student" && req.user.id !== studentID) {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Forbidden: Cannot access another student's profile",
        //   });
        // }
        if (Number.isNaN(studentID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }
        const pool = getPool();
        const [rows] = await pool.query("SELECT * FROM tblstudent WHERE studentID = ? LIMIT 1",
            [studentID]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.json({
            success: true,
            data: rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// -----------------------------
// 3️ UPDATE student profile
//    - admin/staff only
// -----------------------------
// router.put("/:id", protect(["admin", "staff"]), async (req, res) => {
//     try {
//         const studentID = Number(req.params.id);
//         const {
//             LastName,
//             FirstName,
//             MiddleName,
//             DOB,
//             mobileNo,
//             gender,
//             guardianContactNo = null,
//             enrollmentNo,
//             isVegeterian,
//             medicalCondition,
//             deptNo = null,
//             email
//         } = req.body;

//         const pool = getPool();
//         await pool.query(
//             `CALL SaveStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 studentID,
//                 LastName,
//                 FirstName,
//                 MiddleName,
//                 DOB,
//                 mobileNo,
//                 gender,
//                 guardianContactNo,
//                 enrollmentNo,
//                 isVegeterian,
//                 medicalCondition,
//                 deptNo,
//                 email
//             ]
//         );

//         res.json({
//             success: true,
//             message: "Student profile updated successfully",
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// });

router.put("/:id", protect(["admin", "staff"]), async (req, res) => {
    const connection = await getPool().getConnection();

    try {
        const studentID = Number(req.params.id);

        if (Number.isNaN(studentID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const {
            LastName,
            FirstName,
            MiddleName,
            DOB,
            mobileNo,
            gender,
            guardianContactNo = null,
            enrollmentNo,
            isVegeterian,
            medicalCondition,
            deptNo = null,
            email,
        } = req.body;

        await connection.beginTransaction();

        //  Update tblstudent
        const [result] = await connection.query(
            `
      UPDATE tblstudent
      SET
        LastName = ?,
        FirstName = ?,
        MiddleName = ?,
        DOB = ?,
        mobileNo = ?,
        gender = ?,
        deptNo = ?,
        guardianContactNo = ?,
        enrollmentNo = ?,
        isVegeterian = ?,
        medicalCondition = ?,
        email = ?
      WHERE studentID = ?
      `,
            [
                LastName,
                FirstName,
                MiddleName,
                DOB,
                mobileNo,
                gender,
                deptNo,
                guardianContactNo,
                enrollmentNo,
                isVegeterian,
                medicalCondition,
                email,
                studentID,
            ]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        //  Get userID
        const [users] = await connection.query(
            "SELECT userID FROM tblstudent WHERE studentID = ?",
            [studentID]
        );

        const userID = users[0]?.userID;

        //  Update tbluser email
        if (userID) {
            await connection.query(
                "UPDATE tbluser SET email = ? WHERE userID = ?",
                [email, userID]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            message: "Student profile updated successfully",
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    } finally {
        connection.release();
    }
});

// -----------------------------
// 4️ STUDENT DASHBOARD
//    - student can only access their own profile
// -----------------------------
router.get("/dashboard", protect(["student"]), async (req, res) => {
    try {
        const studentID = req.user.id; // from JWT

        const pool = getPool();
        const [rows] = await pool.query("SELECT * FROM tblstudent WHERE studentID = ? LIMIT 1", [studentID]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        res.json({
            success: true,
            data: rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// -----------------------------
// 0️⃣ ADD student (admin/staff)
// -----------------------------
// router.post("/", protect(["admin", "staff"]), async (req, res) => {
//     try {
//         const studentID = 0;
//         const {
//             LastName,
//             FirstName,
//             MiddleName,
//             DOB,
//             mobileNo,
//             gender,
//             guardianContactNo = null,
//             enrollmentNo,
//             isVegeterian,
//             medicalCondition,
//             deptNo = null,
//             email
//         } = req.body;

//         const pool = getPool();

//         await pool.query(
//             `CALL SaveStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 studentID,               
//                 LastName,
//                 FirstName,
//                 MiddleName,
//                 DOB,
//                 mobileNo,
//                 gender,
//                 guardianContactNo,
//                 enrollmentNo,
//                 isVegeterian,
//                 medicalCondition,
//                 deptNo,
//                 email
//             ]
//         );

//         res.status(201).json({
//             success: true,
//             message: "Student added successfully",
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// });

router.post("/", protect(["admin", "staff"]), async (req, res) => {
    const connection = await getPool().getConnection();

    try {
        const {
            LastName,
            FirstName,
            MiddleName,
            DOB,
            mobileNo,
            gender,
            guardianContactNo = null,
            enrollmentNo,
            isVegeterian,
            medicalCondition,
            deptNo = null,
            email,
        } = req.body;

        if (!FirstName || !LastName || !email) {
            return res.status(400).json({
                success: false,
                message: "First name, last name and email are required",
            });
        }

        await connection.beginTransaction();

        // 1️⃣ Insert into tblstudent
        const [studentResult] = await connection.query(
            `
      INSERT INTO tblstudent (
        LastName,
        FirstName,
        MiddleName,
        DOB,
        mobileNo,
        gender,
        deptNo,
        guardianContactNo,
        enrollmentNo,
        isVegeterian,
        medicalCondition,
        email
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                LastName,
                FirstName,
                MiddleName,
                DOB,
                mobileNo,
                gender,
                deptNo,
                guardianContactNo,
                enrollmentNo,
                isVegeterian,
                medicalCondition,
                email,
            ]
        );

        const newStudentID = studentResult.insertId;

        // 2️⃣ Insert into tbluser
        const [userResult] = await connection.query(
            `
      INSERT INTO tbluser (
        email,
        role,
        isActive,
        createdAt
      )
      VALUES (?, 'student', 1, NOW())
      `,
            [email]
        );

        const userID = userResult.insertId;

        // 3️⃣ Update tblstudent with userID
        await connection.query(
            `
      UPDATE tblstudent
      SET userID = ?
      WHERE studentID = ?
      `,
            [userID, newStudentID]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            studentID: newStudentID,
            userID,
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    } finally {
        connection.release();
    }
});


export default router;
