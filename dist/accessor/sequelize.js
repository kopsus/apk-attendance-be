"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const databaseConfig_1 = require("./../config/databaseConfig");
const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
console.log(`${databaseConfig_1.DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
exports.sequelize = DB_PORT === ''
    ? new sequelize_1.Sequelize(`${databaseConfig_1.DIALECT}://${DB_HOST}/${DB_NAME}`, {
        username: DB_USERNAME,
        password: DB_PASSWORD,
    })
    : new sequelize_1.Sequelize(`${databaseConfig_1.DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
        username: DB_USERNAME,
        password: DB_PASSWORD,
    });
