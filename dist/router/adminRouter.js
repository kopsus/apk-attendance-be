"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DOMAIN = 'Admin Router';
const adminRouter = (0, express_1.Router)();
adminRouter.get('/ping', (req, res) => {
    res.send('pong');
});
exports.default = adminRouter;
