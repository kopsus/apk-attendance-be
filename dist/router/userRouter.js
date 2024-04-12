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
const express_1 = require("express");
const employeeEntity_1 = require("../model/employeeEntity");
const companyEntity_1 = require("../model/companyEntity");
const attendanceTimeEntity_1 = require("../model/attendanceTimeEntity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const attendanceTimeService_1 = __importDefault(require("../service/attendanceTimeService"));
const DOMAIN = 'User Router';
const userRouter = (0, express_1.Router)();
userRouter.post('/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Checking if the user exists in the database
            const user = yield employeeEntity_1.employeeEntity.findOne({
                attributes: ['id', 'password', 'company_id', 'role', 'name'],
                where: {
                    email: req.body.email,
                },
            });
            const company = yield companyEntity_1.companyEntity.findOne({
                attributes: ['name', 'longitude', 'latitude'],
                where: {
                    id: user === null || user === void 0 ? void 0 : user.get('company_id'),
                },
            });
            const hashedPassword = user === null || user === void 0 ? void 0 : user.get('password');
            // Check if the password is valid
            if (typeof hashedPassword !== 'string' || hashedPassword === null) {
                res.status(400).send({ error: 'Invalid Password' });
                return;
            }
            // Compare the password
            const match = yield bcrypt_1.default.compare(req.body.password, hashedPassword);
            if (match) {
                const expiredAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
                const accessToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.get('id') }, 'EternalPlus@100', {
                    expiresIn: '1w',
                });
                res.send({
                    success: true,
                    data: {
                        accessToken,
                        expiredAt: expiredAt,
                        companyName: company === null || company === void 0 ? void 0 : company.get('name'),
                        latitude: company === null || company === void 0 ? void 0 : company.get('latitude'),
                        longitude: company === null || company === void 0 ? void 0 : company.get('longitude'),
                        role: user === null || user === void 0 ? void 0 : user.get('role'),
                        name: user === null || user === void 0 ? void 0 : user.get('name'),
                    },
                    message: 'Login Successfully',
                    code: 200,
                });
            }
            else {
                res.status(401).json({ error: 'Invalid Email or Password' });
            }
        }
        catch (err) {
            console.error('Error authenticating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});
// Set up Multer for handling multipart/form-data (file uploads)
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Destination folder for uploaded files
// Endpoint for uploading photos
userRouter.post('/attendance', upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let decoded;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        const authorization = req.headers.authorization.split(' ')[1];
        const secret = 'EternalPlus@100';
        decoded = jsonwebtoken_1.default.verify(authorization, secret);
        console.log(decoded);
    }
    else {
        res.send({
            success: true,
            data: {},
            message: 'Authorization header is not present',
            code: 403,
        });
        return;
    }
    if (typeof decoded === 'string' || !decoded.userId) {
        res.send({
            success: false,
            data: {},
            message: 'Authorization failed',
            code: 403,
        });
        return;
    }
    const lastHistory = yield attendanceTimeEntity_1.attendanceTimeEntity.findAll({
        attributes: ['action', 'timestamp'],
        where: {
            employee_id: decoded.userId,
        },
        order: [['timestamp', 'DESC']],
        limit: 1,
    });
    const companyId = yield employeeEntity_1.employeeEntity.findOne({
        attributes: ['company_id'],
        where: {
            id: decoded.userId,
        },
    });
    const companyTimeline = yield companyEntity_1.companyEntity.findOne({
        attributes: ['clock_in', 'clock_out'],
        where: {
            id: companyId === null || companyId === void 0 ? void 0 : companyId.get('company_id'),
        },
    });
    let action;
    let timestamp = Date.now();
    let clock = new Date(timestamp).toTimeString().slice(3, 9);
    let clockIn = companyTimeline && companyTimeline.get('clock_in') ? new Date(companyTimeline.get('clock_in')).toTimeString().slice(3, 9) : new Date(Date.now()).toTimeString().slice(3, 9);
    let clockOut = companyTimeline && companyTimeline.get('clock_out') ? new Date(companyTimeline.get('clock_out')).toTimeString().slice(3, 9) : new Date(Date.now()).toTimeString().slice(3, 9);
    let status;
    if (!lastHistory || lastHistory.length === 0) {
        action = 'CHECK_IN';
        status = clock < clockIn ? 'LATE' : 'ON TIME';
    }
    else {
        action =
            lastHistory[0].get('action') === 'CHECK_IN'
                ? 'CHECK_OUT'
                : 'CHECK_IN';
        if (action === 'CHECK_OUT') {
            status = clock > clockOut ? 'EARLY' : 'ON TIME';
        }
        else {
            status = clock < clockIn ? 'LATE' : 'ON TIME';
        }
    }
    const imageId = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '';
    const newAttendance = yield attendanceTimeService_1.default.insertAttendace({
        employeeId: decoded.userId,
        action: action,
        imageId: imageId,
        timestamp: timestamp,
        status: status,
    });
    if (newAttendance.errorMessage != null) {
        res.status(500).json({ error: newAttendance.errorMessage });
        return;
    }
    res.send({
        success: true,
        data: {},
        message: `${action} Successfully`,
        code: 200,
    });
}));
userRouter.get('/getHistoryByUserId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        const authorization = req.headers.authorization.split(' ')[1];
        const secret = 'EternalPlus@100';
        decoded = jsonwebtoken_1.default.verify(authorization, secret);
        console.log(decoded);
    }
    else {
        res.send({
            success: true,
            data: {},
            message: 'Authorization header is not present',
            code: 403,
        });
        return;
    }
    let historyUser;
    if (typeof decoded !== 'string' && 'userId' in decoded) {
        historyUser = yield attendanceTimeEntity_1.attendanceTimeEntity.findAll({
            attributes: ['action', 'timestamp', 'status'],
            where: {
                employee_id: decoded.userId,
            },
        });
    }
    res.send({
        success: true,
        data: historyUser,
        message: 'Get History Success',
        code: 200,
    });
}));
userRouter.get('/getAttendanceStatus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        const authorization = req.headers.authorization.split(' ')[1];
        const secret = 'EternalPlus@100';
        decoded = jsonwebtoken_1.default.verify(authorization, secret);
        console.log(decoded);
    }
    else {
        res.send({
            success: true,
            data: {},
            message: 'Authorization header is not present',
            code: 403,
        });
        return;
    }
    let historyUser;
    let companyDetail;
    let companyId;
    if (typeof decoded !== 'string' && 'userId' in decoded) {
        historyUser = yield attendanceTimeEntity_1.attendanceTimeEntity.findAll({
            attributes: ['action', 'timestamp'],
            where: {
                employee_id: decoded.userId,
            },
            order: [['timestamp', 'DESC']],
            limit: 1,
        });
        companyId = yield employeeEntity_1.employeeEntity.findOne({
            attributes: ['company_id'],
            where: {
                id: decoded.userId,
            },
        });
        companyDetail = yield companyEntity_1.companyEntity.findOne({
            attributes: ['latitude', 'longitude', 'address'],
            where: {
                id: companyId === null || companyId === void 0 ? void 0 : companyId.get('company_id'),
            },
        });
    }
    if (historyUser && historyUser[0]) {
        console.log(historyUser[0].get('action'));
        const lastAction = historyUser[0].get('action');
        if (lastAction === 'CHECK_IN') {
            res.send({
                success: true,
                data: {
                    action: 'clock-out',
                    clockIn: historyUser[0].get('timestamp'),
                    clockOut: null,
                    companyAddress: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('address'),
                    companyLatitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('latitude'),
                    companyLongitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('longitude'),
                },
                message: 'Get Attendance Status Success',
                code: 200,
            });
        }
        else {
            res.send({
                success: true,
                data: {
                    action: 'clock-in',
                    clockIn: null,
                    clockOut: null,
                    companyAddress: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('address'),
                    companyLatitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('latitude'),
                    companyLongitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('longitude'),
                },
                message: 'Get Attendance Status Success',
                code: 200,
            });
        }
    }
    else {
        res.send({
            success: true,
            data: {
                action: 'clock-in',
                clockIn: null,
                clockOut: null,
                companyAddress: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('address'),
                companyLatitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('latitude'),
                companyLongitude: companyDetail === null || companyDetail === void 0 ? void 0 : companyDetail.get('longitude'),
            },
            message: 'Get Attendance Status Success',
            code: 200,
        });
    }
}));
exports.default = userRouter;
