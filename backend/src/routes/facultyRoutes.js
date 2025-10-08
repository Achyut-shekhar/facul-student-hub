import express from "express";
import { protect, faculty } from "../middleware/authMiddleware.js";
import {
  createClass,
  getClasses,
  startSession,
  endSession,
  getSessionAttendance,
} from "../controllers/facultyController.js";

const router = express.Router();

// All routes require faculty authentication
router.use(protect, faculty);

router.post("/classes", createClass);
router.get("/classes", getClasses);
router.post("/classes/:classId/sessions", startSession);
router.put("/classes/:classId/sessions/:sessionId/end", endSession);
router.get("/classes/:classId", getSessionAttendance);

export default router;
