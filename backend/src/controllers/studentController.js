import {
  findClassByCode,
  addStudentToClass,
  getClassesByStudent,
  getActiveSession,
  markAttendance
} from '../store/index.js';

// Join a class
export const joinClass = (req, res) => {
  const { joinCode } = req.body;
  const studentId = req.user.id;

  const classToJoin = findClassByCode(joinCode);
  if (!classToJoin) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const joined = addStudentToClass(classToJoin.id, studentId);
  if (!joined) {
    return res.status(400).json({ message: 'Already enrolled in this class' });
  }

  res.json({ message: 'Successfully joined class', class: classToJoin });
};

// Get student's enrolled classes
export const getEnrolledClasses = (req, res) => {
  const studentId = req.user.id;
  const classes = getClassesByStudent(studentId);
  res.json(classes);
};

// Mark attendance
export const markAttendanceWithCode = (req, res) => {
  const { classId, code } = req.body;
  const studentId = req.user.id;

  // Check if session is active
  const session = getActiveSession(classId);
  if (!session) {
    return res.status(404).json({ message: 'No active session found' });
  }

  // Verify attendance code and mark attendance
  const marked = markAttendance(classId, studentId, code);
  if (!marked) {
    return res.status(400).json({ message: 'Invalid code or attendance already marked' });
  }

  res.json({ message: 'Attendance marked successfully' });
};