import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js"; // your Sequelize instance

export const User = sequelize.define("User", {
  userID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  pass: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "staff", "admin"),
    allowNull: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  refreshToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  resetToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "tblUser",  
  timestamps: true,      
});
