"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sortOrderEnum_1 = require("../model/enum/sortOrderEnum");
const sequelize_2 = require("./sequelize");
const getAllAttendanceTimes = (limit, offset, sortBy, sortOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT Employee.name as name, Company.id as companyId, Company.name as companyName, AttendanceTime.action as action, Attendancetime.timestamp as time '
        + 'FROM Employee, Company, AttendanceTime '
        + 'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id '
        + `ORDER BY AttendanceTime.${sortBy} ${sortOrderEnum_1.SortOrderEnum[sortOrder]} `
        + `LIMIT ${limit} `
        + `OFFSET ${offset};`;
    const data = yield sequelize_2.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
    return data;
});
exports.default = {
    getAllAttendanceTimes
};
