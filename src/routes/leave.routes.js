import express from "express";
import { applyLeave, getAllLeaves, approveLeave, getMyLeaves } from "../controllers/leave.controllers.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();
// student
router.post(
  "/apply",
  protect(["student"]),
  applyLeave
);
// admin
router.get(
  "/all",
  protect(["admin"]),
  getAllLeaves
);

router.put(
  "/approve/:leaveID",
  protect(["admin"]),
  approveLeave
);
router.get(
  "/my",
  protect(["student"]),
  getMyLeaves
);

export default router;
