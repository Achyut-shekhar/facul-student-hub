import { getDistance } from "geolib";
import AttendanceSession from "../models/AttendanceSession.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import Class from "../models/Class.js";

// Generate a random attendance code
const generateAttendanceCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Start a new attendance session
export const startSession = async (req, res) => {
  try {
    const { classId, method, location } = req.body;

    // Verify faculty owns the class
    const classExists = await Class.findOne({
      where: {
        id: classId,
        facultyId: req.user.id,
      },
    });

    if (!classExists) {
      return res
        .status(404)
        .json({ message: "Class not found or unauthorized" });
    }

    // Check if there's already an active session
    const activeSession = await AttendanceSession.findOne({
      where: {
        classId,
        status: "ACTIVE",
      },
    });

    if (activeSession) {
      return res
        .status(400)
        .json({ message: "An active session already exists for this class" });
    }

    // Create new session
    const session = await AttendanceSession.create({
      classId,
      attendanceCode: generateAttendanceCode(),
      attendanceMethod: method,
      location: location,
      startTime: new Date(),
    });

    res.status(201).json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starting session", error: error.message });
  }
};

// End an attendance session
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await AttendanceSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "ENDED";
    session.endTime = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error ending session", error: error.message });
  }
};

// Mark attendance with code
export const markAttendanceWithCode = async (req, res) => {
  try {
    const { sessionId, code } = req.body;
    const studentId = req.user.id;

    const session = await AttendanceSession.findOne({
      where: {
        id: sessionId,
        status: "ACTIVE",
        attendanceMethod: "CODE",
      },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "No active code-based session found" });
    }

    if (session.attendanceCode !== code) {
      return res.status(400).json({ message: "Invalid attendance code" });
    }

    const record = await AttendanceRecord.create({
      sessionId,
      studentId,
      status: "PRESENT",
      markedAt: new Date(),
      verificationMethod: "CODE",
    });

    res.status(201).json(record);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
  }
};

// Mark attendance with location
export const markAttendanceWithLocation = async (req, res) => {
  try {
    const { sessionId, location } = req.body;
    const studentId = req.user.id;

    const session = await AttendanceSession.findOne({
      where: {
        id: sessionId,
        status: "ACTIVE",
        attendanceMethod: "LOCATION",
      },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "No active location-based session found" });
    }

    // Check if student is within range (50 meters)
    const distance = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      {
        latitude: session.location.latitude,
        longitude: session.location.longitude,
      }
    );

    if (distance > 50) {
      return res
        .status(400)
        .json({ message: "You are too far from the class location" });
    }

    const record = await AttendanceRecord.create({
      sessionId,
      studentId,
      status: "PRESENT",
      markedAt: new Date(),
      verificationMethod: "LOCATION",
      location,
    });

    res.status(201).json(record);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
  }
};

// Mark attendance manually (faculty only)
export const markAttendanceManually = async (req, res) => {
  try {
    const { sessionId, studentIds } = req.body;

    const session = await AttendanceSession.findOne({
      where: {
        id: sessionId,
        attendanceMethod: "MANUAL",
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Mark attendance for each student
    const records = await Promise.all(
      studentIds.map((studentId) =>
        AttendanceRecord.create({
          sessionId,
          studentId,
          status: "PRESENT",
          markedAt: new Date(),
          verificationMethod: "MANUAL",
        })
      )
    );

    res.status(201).json(records);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
  }
};

// Get session attendance records
export const getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const records = await AttendanceRecord.findAll({
      where: { sessionId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(records);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching attendance records",
        error: error.message,
      });
  }
};
