"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const loggerUtil_1 = __importDefault(require("./util/loggerUtil"));
const databaseConnectionInitializer_1 = require("./accessor/databaseConnectionInitializer");
const modelInitializer_1 = require("./model/modelInitializer");
const loggerUtil_2 = __importDefault(require("./util/loggerUtil"));
const DOMAIN = 'ROOT';
const app = (0, express_1.default)();
const port = 3000;
// Init database
(0, databaseConnectionInitializer_1.initDbConnection)()
    .then(() => {
    (0, modelInitializer_1.initModel)();
})
    .catch((err) => {
    loggerUtil_2.default.log(DOMAIN, `Error when initialization: ${JSON.stringify(err)}`);
});
app.get('/healthcheck', (req, res) => {
    res.send('Healthy!');
});
// Use the external router for the specific path
app.use('/admin', adminRouter_1.default);
app.use('*', (req, res) => {
    loggerUtil_1.default.log(DOMAIN, `Unhandled path: ${req.originalUrl}`);
    res.status(404).send('Not Found');
});
app.listen(port, () => {
    loggerUtil_1.default.log(DOMAIN, `Server is running on http://localhost:${port}`);
});
