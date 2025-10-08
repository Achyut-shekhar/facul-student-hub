import express from "express";
import { protect, student } from "../middleware/authMiddleware.js";
import {
  joinClass,
  getEnrolledClasses,
  markAttendanceWithCode,
} from "../controllers/studentController.js";

const router = express.Router();

// All routes require student authentication
router.use(protect, student);

router.post("/class/join", joinClass);
router.get("/classes", getEnrolledClasses);
router.post("/attendance/mark", markAttendanceWithCode);

export default router;
