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
// 1️⃣ GET all students - admin/staff only
// -----------------------------
router.get("/", protect(["admin", "staff"]), async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("CALL GetStudentList()");
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
// 2️⃣ GET single student profile
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

    const pool = getPool();
    const [rows] = await pool.query("CALL GetStudentByID(?)", [studentID]);
    if (rows[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: rows[0][0],
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
// 3️⃣ UPDATE student profile
//    - admin/staff only
// -----------------------------
router.put("/:id", protect(["admin", "staff"]), async (req, res) => {
  try {
    const studentID = Number(req.params.id);
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
      email
    } = req.body;

    const pool = getPool();
    await pool.query(
      `CALL SaveStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentID,
        LastName,
        FirstName,
        MiddleName,
        DOB,
        mobileNo,
        gender,
        guardianContactNo,
        enrollmentNo,
        isVegeterian,
        medicalCondition,
        deptNo,
        email
      ]
    );

    res.json({
      success: true,
      message: "Student profile updated successfully",
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
// 4️⃣ STUDENT DASHBOARD
//    - student can only access their own profile
// -----------------------------
router.get("/dashboard", protect(["student"]), async (req, res) => {
  try {
    const studentID = req.user.id; // from JWT

    const pool = getPool();
    const [rows] = await pool.query("CALL GetStudentByID(?)", [studentID]);

    if (rows[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      data: rows[0][0],
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
router.post("/", protect(["admin", "staff"]), async (req, res) => {
  try {
    const studentID = 0;
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
      email
    } = req.body;

    const pool = getPool();

    await pool.query(
      `CALL SaveStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentID,               // 👈 VERY IMPORTANT (0 = INSERT)
        LastName,
        FirstName,
        MiddleName,
        DOB,
        mobileNo,
        gender,
        guardianContactNo,
        enrollmentNo,
        isVegeterian,
        medicalCondition,
        deptNo,
        email
      ]
    );

    res.status(201).json({
      success: true,
      message: "Student added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


export default router;
