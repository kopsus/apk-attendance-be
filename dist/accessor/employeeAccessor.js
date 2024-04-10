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
const employeeEntity_1 = require("../model/employeeEntity");
const loggerUtil_1 = __importDefault(require("../util/loggerUtil"));
const DOMAIN = 'Employee Accessor';
const insertEmployee = (_a) => __awaiter(void 0, [_a], void 0, function* ({ companyId, email, hashedPassword, role, }) {
    try {
        const newEmployee = yield employeeEntity_1.employeeEntity.create({
            email: email,
            password: hashedPassword,
            company_id: companyId,
            role: role,
        });
        return { data: newEmployee };
    }
    catch (error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return { errorMessage: 'Email is already exists' };
        }
        loggerUtil_1.default.error(DOMAIN, `Got error when inserting employee: ${JSON.stringify(error)}`);
        throw error;
    }
});
exports.default = {
    insertEmployee,
};
