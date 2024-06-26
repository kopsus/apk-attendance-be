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
const employeeAccessor_1 = __importDefault(require("../accessor/employeeAccessor"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const insertEmployee = (_a) => __awaiter(void 0, [_a], void 0, function* ({ companyId, email, plainPassword, role, name, }) {
    const hashedPassword = yield bcrypt_1.default.hash(plainPassword, 10);
    return yield employeeAccessor_1.default.insertEmployee({
        companyId,
        email,
        hashedPassword,
        role,
        name,
    });
});
exports.default = {
    insertEmployee,
};
