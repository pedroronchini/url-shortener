const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Url = sequelize.define('Url', {
    originalUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortUrl: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Y',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
});

Url.belongsTo(User, { foreignKey: 'createdBy', allowNull: true });

module.exports = Url;
