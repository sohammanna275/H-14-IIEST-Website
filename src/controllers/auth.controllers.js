import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "../db/connect.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

// import { sendEmail } from "../utils/email.js";

// login 

const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required");
    }
    const pool = getPool();
    const [resultSets] = await pool.query("CALL ValidateLogin(?, ?)", [email, "student"]);
    const user = resultSets[0][0];    
    if(!user || !user.userID){
        throw new ApiError(401, "Invalid Email or Password");
    }
    if(user.isActive === 0){
        throw new ApiError(403, "User Not Active");
    }
    const isMatch = await bcrypt.compare(password, user.pass);
    if(!isMatch){
        throw new ApiError(401, "Invalid Email or Password");
    }
    // jwt
    const accessToken = jwt.sign(
    {
        id: user.userID,
        role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        role: user.role
    });
});
// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    
    const pool = getPool();
    // Call your stored procedure to validate login
    const [resultSets] = await pool.query("CALL ValidateLogin(?, ?)", [email, "admin"]);
    const user = resultSets[0][0];

    if (!user || !user.userID) {
        throw new ApiError(401, "Invalid Email or Password");
    }

    if (user.isActive === 0) {
        throw new ApiError(403, "User Not Active");
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch) {
        throw new ApiError(401, "Invalid Email or Password");
    }

    // Generate JWT
    const accessToken = jwt.sign(
        {
            id: user.userID,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({
        success: true,
        message: "Admin login successful",
        accessToken,
        role: user.role
    });
});

const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, "Email is required");
    }
    const pool = getPool();
    const [users] = await pool.query(
        "SELECT userID from tbluser where email = ? AND isActive = 1",
        [email]
    );
    if(users.length === 0){
        return res.json({
            message: "If the email exists, a reset link has been sent",
        });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // expiry 15 mins
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
        `UPDATE tbluser
        SET resetToken = ?, resetTokenExpiry = ?, updatedAt = NOW()
        WHERE email = ?`,
        [hashedToken, resetTokenExpiry, email]
    );
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(email, "Reset Your Hostel-14 Password", resetLink);
    res.json({
    message: "If the email exists, a reset link has been sent",
  });
});
// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "Password is required");
  }

  const pool = getPool();


    //  STEP 1: Hash incoming token

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

 
     // STEP 2: Find valid token

  const [users] = await pool.query(
    `SELECT userID
     FROM tbluser
     WHERE resetToken = ?
       AND resetTokenExpiry > NOW()
       AND isActive = 1`,
    [hashedToken]
  );

  if (users.length === 0) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // STEP 3: Hash new password */
  const hashedPassword = await bcrypt.hash(newPassword, 10);


     //STEP 4: Update password + clear token

  await pool.query(
    `UPDATE tbluser
     SET pass = ?, 
         resetToken = NULL, 
         resetTokenExpiry = NULL,
         updatedAt = NOW()
     WHERE userID = ?`,
    [hashedPassword, users[0].userID]
  );

  res.json({
    message: "Password reset successful",
  });
});

export default resetPassword;

export {forgotPassword, loginAdmin, loginStudent, resetPassword};

