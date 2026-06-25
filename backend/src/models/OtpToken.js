const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpToken = sequelize.define('OtpToken', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: true });

module.exports = OtpToken;
