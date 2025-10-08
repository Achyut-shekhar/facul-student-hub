import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Class from "./Class.js";

const AttendanceSession = sequelize.define("AttendanceSession", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Class,
      key: "id",
    },
  },
  attendanceCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("ACTIVE", "ENDED"),
    defaultValue: "ACTIVE",
  },
  attendanceMethod: {
    type: DataTypes.ENUM("CODE", "LOCATION", "MANUAL"),
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

// Session associations
AttendanceSession.belongsTo(Class, { foreignKey: "classId" });

export default AttendanceSession;
