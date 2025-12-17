// import jwt from "jsonwebtoken";
// import { asyncHandler } from "../utils/async-handler.js";
// import { ApiError } from "../utils/api-error.js";
// import dotenv from "dotenv";

// const protectStudent = asyncHandler(async (req, res, next) => {
//     // step 1
//     // client sends like Authorization: Bearer eyJhbGciOiJIUzI1NiIs..
//     // authHeader === "Bearer <token>"
//     authHeader = req.headers.authorization;
//     // step 2
//     // checking if there is any wrong if bearer not present etc
//     if(!authHeader || !authHeader.startsWith("Bearer ")){
//         throw new ApiError(401, "Authentication token missing");
//     }
//     // step 3
//     // example - "Bearer abc.def.ghi".split(" ")
//     // So - token = "abc.def.ghi"
//     const token = authHeader.split(" ")[1];
//     // step 4 verify
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     // step 5 role authorization
//     if(decoded.role !== "student"){
//         throw new ApiError(403, "Access Denied");
//     }
//     // step 6 attach user to request
//     req.user = decoded;
//     // step 7 continue request
//     next();
//     /*
//     Request
//   ↓
// protectStudent middleware
//   ↓
// check token
//   ↓
// verify JWT
//   ↓
// check role
//   ↓
// req.user set
//   ↓
// next()
//   ↓
// Controller / Route
    
//     */
// });
// export {protectStudent};

// middleware/auth.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const protect = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!allowedRoles.includes(decoded.role)) {
      throw new ApiError(403, "Access denied");
    }

    req.user = decoded; // { id, role }
    next();
  });

export { protect };
