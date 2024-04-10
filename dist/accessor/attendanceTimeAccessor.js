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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sortOrderEnum_1 = require("../model/enum/sortOrderEnum");
const sequelize_2 = require("./sequelize");
const attendanceTimeEntity_1 = require("../model/attendanceTimeEntity");
const loggerUtil_1 = __importDefault(require("../util/loggerUtil"));
const DOMAIN = 'Attendance Time Accessor';
const getAllAttendanceTimes = (limit, offset, sortBy, sortOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT Employee.name as name, Company.id as companyId, Company.name as companyName, AttendanceTime.action as action, Attendancetime.timestamp as time ' +
        'FROM Employee, Company, AttendanceTime ' +
        'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id ' +
        `ORDER BY ${sortBy} ${sortOrderEnum_1.SortOrderEnum[sortOrder]} ` +
        `LIMIT ${limit} ` +
        `OFFSET ${offset};`;
    const data = yield sequelize_2.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
    return data;
});
const getAllAttendanceTimesCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT COUNT(*) as total FROM Employee, Company, AttendanceTime ' +
        'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id;';
    const data = yield sequelize_2.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
    return data.map(each => each);
});
const insertAttendace = (_a) => __awaiter(void 0, [_a], void 0, function* ({ employeeId, action, imageId, timestamp, }) {
    try {
        const newEmployee = yield attendanceTimeEntity_1.attendanceTimeEntity.create({
            employee_id: employeeId,
            action: action,
            image_id: imageId,
            timestamp: timestamp
        });
        return { data: newEmployee };
    }
    catch (error) {
        loggerUtil_1.default.error(DOMAIN, `Got error when inserting employee: ${JSON.stringify(error)}`);
        throw error;
    }
});
exports.default = {
    getAllAttendanceTimes,
    insertAttendace,
    getAllAttendanceTimesCount,
};
