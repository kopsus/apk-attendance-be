"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const loggerUtil_1 = __importDefault(require("../util/loggerUtil"));
const companyEntity_1 = require("./companyEntity");
const CLASS_NAME = 'Model Initializer';
const initModel = () => {
    companyEntity_1.companyEntity
        .sync({ alter: true })
        .catch((e) => loggerUtil_1.default.log(CLASS_NAME, `Error when init company entity. Error: ${e}`));
};
exports.initModel = initModel;
