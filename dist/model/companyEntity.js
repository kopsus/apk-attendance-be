"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyEntity = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./../accessor/sequelize");
exports.companyEntity = sequelize_2.sequelize.define('Company', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'name',
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    clock_in: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    clock_out: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});
