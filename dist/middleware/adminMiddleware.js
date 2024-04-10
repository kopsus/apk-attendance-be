"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const ADMIN_PASSWORD_KEY = process.env.ADMIN_PASSWORD_KEY;
const adminMiddleware = (req, res, next) => {
    const adminPassword = req.headers["authorization"];
    if (adminPassword !== ADMIN_PASSWORD_KEY) {
        return res.status(403).send();
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
