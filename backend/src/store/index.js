// In-memory data store
let store = {
  users: [],
  classes: [],
  sessions: {},
  attendanceRecords: []
};

// Initialize with default data if empty
if (!store.users.length) {
  store.users = [
    {
      id: '1',
      name: 'Faculty Demo',
      email: 'faculty@school.edu',
      password: 'password',
      role: 'FACULTY'
    },
    {
      id: '2',
      name: 'Student Demo',
      email: 'student@school.edu',
      password: 'password',
      role: 'STUDENT'
    }
  ];
}

export { store };

// Helper functions for managing data
export const findUserByEmail = (email) => {
  return store.users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return store.users.find(user => user.id === id);
};

export const addClass = (classData) => {
  const newClass = {
    id: Date.now().toString(),
    ...classData,
    students: []
  };
  store.classes.push(newClass);
  return newClass;
};

export const getClassesByFaculty = (facultyId) => {
  return store.classes.filter(cls => cls.facultyId === facultyId);
};

export const getClassesByStudent = (studentId) => {
  return store.classes.filter(cls => cls.students.includes(studentId));
};

export const findClassByCode = (joinCode) => {
  return store.classes.find(cls => cls.joinCode === joinCode);
};

export const findClassById = (classId) => {
  return store.classes.find(cls => cls.id === classId);
};

export const addStudentToClass = (classId, studentId) => {
  const classToUpdate = store.classes.find(cls => cls.id === classId);
  if (classToUpdate && !classToUpdate.students.includes(studentId)) {
    classToUpdate.students.push(studentId);
    return true;
  }
  return false;
};

export const startAttendanceSession = (classId, code) => {
  store.sessions[classId] = {
    id: Date.now().toString(),
    classId,
    code,
    startTime: new Date(),
    status: 'ACTIVE',
    presentStudents: []
  };
  return store.sessions[classId];
};

export const endAttendanceSession = (classId) => {
  if (store.sessions[classId]) {
    store.sessions[classId].status = 'ENDED';
    store.sessions[classId].endTime = new Date();
    return store.sessions[classId];
  }
  return null;
};

export const getActiveSession = (classId) => {
  return store.sessions[classId]?.status === 'ACTIVE' ? store.sessions[classId] : null;
};

export const markAttendance = (classId, studentId, code) => {
  const session = store.sessions[classId];
  if (session && session.status === 'ACTIVE' && session.code === code) {
    if (!session.presentStudents.includes(studentId)) {
      session.presentStudents.push(studentId);
      store.attendanceRecords.push({
        id: Date.now().toString(),
        sessionId: session.id,
        studentId,
        status: 'PRESENT',
        markedAt: new Date()
      });
      return true;
    }
  }
  return false;
};

export default store;