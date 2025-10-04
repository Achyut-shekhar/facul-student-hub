import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import AttendanceSession from './AttendanceSession.js';

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AttendanceSession,
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('PRESENT', 'ABSENT'),
    allowNull: false,
    defaultValue: 'ABSENT'
  },
  markedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationMethod: {
    type: DataTypes.ENUM('CODE', 'LOCATION', 'MANUAL'),
    allowNull: false
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

// Record associations
AttendanceRecord.belongsTo(AttendanceSession, { foreignKey: 'sessionId' });
AttendanceRecord.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

export default AttendanceRecord;