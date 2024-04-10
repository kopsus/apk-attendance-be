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
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    company_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});
