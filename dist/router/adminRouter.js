"use strict";
// src/routers/externalRouter.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DOMAIN = 'ADMIN_ROUTER';
const adminRouter = (0, express_1.Router)();
// adminRouter.all('*', (req: Request, res: Response) => {
//     LoggerUtil.log(DOMAIN, `Got request to ${req.path} with body: ${req.body}`)
//   res.send(`Handling all requests for ${req.path}`);
// });
adminRouter.get('/ping', (req, res) => {
    res.send('pong');
});
exports.default = adminRouter;
