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
                attributes: ['id', 'password'],
                where: {
                    email: req.body.email,
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
                const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const accessToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.get('id') }, 'EternalPlus@100', {
                    expiresIn: '1w',
                });
                res.send({
                    success: true,
                    data: { accessToken,
                        expiredAt: expiredAt,
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
    const { employeeId, action } = req.body;
    const imageId = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '';
    const newAttendance = yield attendanceTimeService_1.default.insertAttendace({
        employeeId: employeeId,
        action: action,
        imageId: imageId,
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
// userRouter.get(
//     '/user-history',
//     asyncHandler(async (req: Request, res: Response) => {
//         const response = await companyService.getCompanyList()
//         const curatedResponse = response.map((company) => ({
//             id: company.id,
//             name: company.name,
//         }))
//         res.send(curatedResponse)
//     }),
// )
exports.default = userRouter;
