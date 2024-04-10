"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const loggerUtil_1 = __importDefault(require("../util/loggerUtil"));
const attendanceTimeEntity_1 = require("./attendanceTimeEntity");
const companyEntity_1 = require("./companyEntity");
const employeeEntity_1 = require("./employeeEntity");
const CLASS_NAME = 'Model Initializer';
const initModel = () => {
    companyEntity_1.companyEntity
        .sync({ alter: true })
        .catch((e) => loggerUtil_1.default.info(CLASS_NAME, `Error when init company entity. Error: ${e}`));
    employeeEntity_1.employeeEntity
        .sync({ alter: true })
        .catch((e) => loggerUtil_1.default.info(CLASS_NAME, `Error when init employee entity. Error: ${e}`));
    attendanceTimeEntity_1.attendanceTimeEntity
        .sync({ alter: true })
        .catch((e) => loggerUtil_1.default.info(CLASS_NAME, `Error when init attendance time entity. Error: ${e}`));
};
exports.initModel = initModel;
