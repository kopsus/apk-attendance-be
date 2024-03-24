"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDbConnection = void 0;
const sequelize_1 = require("./sequelize");
const initDbConnection = () => sequelize_1.sequelize.authenticate();
exports.initDbConnection = initDbConnection;
