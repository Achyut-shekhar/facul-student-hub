import express from 'express';
import { protect, faculty, student } from '../middleware/authMiddleware.js';
import {
  startSession,
  endSession,
  markAttendanceWithCode,
  markAttendanceWithLocation,
  markAttendanceManually,
  getSessionAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// Faculty routes
router.post('/session/start', protect, faculty, startSession);
router.post('/session/:sessionId/end', protect, faculty, endSession);
router.post('/manual', protect, faculty, markAttendanceManually);
router.get('/session/:sessionId', protect, faculty, getSessionAttendance);

// Student routes
router.post('/code', protect, student, markAttendanceWithCode);
router.post('/location', protect, student, markAttendanceWithLocation);

export default router;