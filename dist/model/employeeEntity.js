"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeEntity = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./../accessor/sequelize");
exports.employeeEntity = sequelize_2.sequelize.define('Employee', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'email',
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    company_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});
