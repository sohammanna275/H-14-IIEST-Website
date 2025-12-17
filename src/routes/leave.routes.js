import express from "express";
import { applyLeave } from "../controllers/leave.controllers.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/apply",
  protect(["student"]),
  applyLeave
);

export default router;
