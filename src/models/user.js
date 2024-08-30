const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
},{
  hooks: {
    beforeCreate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

module.exports = User;
