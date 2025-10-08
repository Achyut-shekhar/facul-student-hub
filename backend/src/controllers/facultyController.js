import {
  addClass,
  getClassesByFaculty,
  startAttendanceSession,
  endAttendanceSession,
  findClassById,
  getActiveSession,
} from "../store/index.js";

// Create a new class
export const createClass = (req, res) => {
  const { name } = req.body;
  const facultyId = req.user.id;

  // Generate a random join code
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newClass = addClass({
    name,
    joinCode,
    facultyId,
    createdAt: new Date(),
  });

  res.status(201).json(newClass);
};

// Get faculty's classes
export const getClasses = (req, res) => {
  const facultyId = req.user.id;
  const classes = getClassesByFaculty(facultyId);
  res.json(classes);
};

// Start attendance session
export const startSession = (req, res) => {
  const { classId } = req.params;
  const facultyId = req.user.id;

  // Verify faculty owns the class
  const classData = findClassById(classId);
  if (!classData || classData.facultyId !== facultyId) {
    return res.status(404).json({ message: "Class not found or unauthorized" });
  }

  // Check if there's already an active session
  const activeSession = getActiveSession(classId);
  if (activeSession) {
    return res
      .status(400)
      .json({ message: "An active session already exists for this class" });
  }

  // Generate attendance code
  const attendanceCode = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  // Start new session
  const session = startAttendanceSession(classId, attendanceCode);
  res.json(session);
};

// End attendance session
export const endSession = (req, res) => {
  const { classId } = req.params;
  const facultyId = req.user.id;

  // Verify faculty owns the class
  const classData = findClassById(classId);
  if (!classData || classData.facultyId !== facultyId) {
    return res.status(404).json({ message: "Class not found or unauthorized" });
  }

  const session = endAttendanceSession(classId);
  if (!session) {
    return res.status(404).json({ message: "No active session found" });
  }

  res.json(session);
};

// Get session attendance
export const getSessionAttendance = (req, res) => {
  const { classId } = req.params;
  const session = getActiveSession(classId);
  if (!session) {
    return res.status(404).json({ message: "No active session found" });
  }
  res.json(session);
};
