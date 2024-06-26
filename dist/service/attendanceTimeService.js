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
const sortOrderEnum_1 = require("../model/enum/sortOrderEnum");
const attendanceTimeAccessor_1 = __importDefault(require("./../accessor/attendanceTimeAccessor"));
const getAllAttendanceTimes = (limit, offset, sortBy, sortOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const sortOrderEnum = sortOrderEnum_1.SortOrderEnum[sortOrder];
    const attendanceTimesData = yield attendanceTimeAccessor_1.default.getAllAttendanceTimes(limit, offset, sortBy, sortOrderEnum);
    const attendanceTimesCountRows = yield attendanceTimeAccessor_1.default.getAllAttendanceTimesCount();
    return {
        data: attendanceTimesData,
        count: attendanceTimesCountRows[0].total,
    };
});
const insertAttendace = (_a) => __awaiter(void 0, [_a], void 0, function* ({ employeeId, action, imageId, timestamp, status, }) {
    return yield attendanceTimeAccessor_1.default.insertAttendace({
        employeeId,
        action,
        imageId,
        timestamp,
        status,
    });
});
exports.default = {
    getAllAttendanceTimes,
    insertAttendace,
};
