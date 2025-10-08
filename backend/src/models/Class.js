import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Class = sequelize.define("Class", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joinCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  facultyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Class associations
Class.belongsTo(User, { as: "faculty", foreignKey: "facultyId" });
Class.belongsToMany(User, {
  through: "StudentClass",
  as: "students",
  foreignKey: "classId",
  otherKey: "studentId",
});

export default Class;
