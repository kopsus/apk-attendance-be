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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const attendanceTimeService_1 = __importDefault(require("./../service/attendanceTimeService"));
const companyService_1 = __importDefault(require("../service/companyService"));
const employeeService_1 = __importDefault(require("../service/employeeService"));
const adminRouter = (0, express_1.Router)();
adminRouter.use(adminMiddleware_1.adminMiddleware);
adminRouter.get('/ping', (req, res) => {
    res.send('pong');
});
adminRouter.post('/signup', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId, email, password, role, name } = req.body;
    const newUser = yield employeeService_1.default.insertEmployee({
        companyId: companyId,
        email: email,
        plainPassword: password,
        role: role,
        name: name
    });
    if (newUser.errorMessage != null) {
        res.status(500).json({ error: newUser.errorMessage });
        return;
    }
    res.send({
        success: true,
        data: {},
        message: 'Data Created',
        code: 200,
    });
})));
adminRouter.get('/attendance-time', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const sortBy = req.query.sortBy.toString();
    const sortOrder = req.query.sortOrder.toString();
    const response = yield attendanceTimeService_1.default.getAllAttendanceTimes(limit, offset, sortBy, sortOrder);
    res.send(response);
})));
adminRouter.get('/companies', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield companyService_1.default.getCompanyList();
    const curatedResponse = response.map((company) => ({
        id: company.id,
        name: company.name,
    }));
    res.send(curatedResponse);
})));
exports.default = adminRouter;
