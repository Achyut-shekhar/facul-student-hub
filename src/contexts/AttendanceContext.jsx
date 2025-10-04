import { createContext, useState, useContext, useEffect } from "react";

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    try {
      const savedSessions = localStorage.getItem("attendanceSessions");
      return savedSessions ? JSON.parse(savedSessions) : {};
    } catch (error) {
      console.error("Failed to parse sessions from localStorage", error);
      return {};
    }
  });
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("attendanceSessions", JSON.stringify(sessions));
    } catch (error) {
      console.error("Failed to save sessions to localStorage", error);
    }
  }, [sessions]);

  const startSession = (classId, method = "manual") => {
    setSessions((prev) => ({
      ...prev,
      [classId]: { status: "active", method },
    }));
    setUpdateCounter((c) => c + 1);
  };

  const endSession = (classId) => {
    setSessions((prev) => ({ ...prev, [classId]: { status: "ended" } }));
    setUpdateCounter((c) => c + 1);
  };

  const getSessionStatus = (classId) => {
    return sessions[classId]?.status;
  };

  const value = {
    sessions,
    startSession,
    endSession,
    getSessionStatus,
    updateCounter,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
