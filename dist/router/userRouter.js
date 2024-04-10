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
// import multer from 'multer'
const DOMAIN = 'User Router';
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
            // Insert a new user into the database
            const newUser = yield employeeEntity_1.employeeEntity.create({
                email: req.body.email,
                password: hashedPassword,
                companyId: req.body.company_id,
            });
            // Response status code 200
            res.send({
                success: true,
                data: {},
                message: 'Data Created',
                code: 200,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});
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
                const access_token = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.get('id') }, 'EternalPlus@100', {
                    expiresIn: '1w',
                });
                res.send({
                    success: true,
                    data: { access_token },
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
// const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
// // Endpoint for uploading photos
// userRouter.post('/attendance', upload.single('photo'), (req: Request, res: Response) => {
//     // Access uploaded file via req.file
//     // console.log(req.file);
//     // Handle file storage, processing, or any other operations
//     res.send('File uploaded successfully');
// });
exports.default = userRouter;