const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  review: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  history: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, { timestamps: true });

module.exports = Rating;
