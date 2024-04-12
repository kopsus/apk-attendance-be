"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceTimeEntity = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./../accessor/sequelize");
exports.attendanceTimeEntity = sequelize_2.sequelize.define('AttendanceTime', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    image_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'imageId',
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});
