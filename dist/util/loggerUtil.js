"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerUtil {
    static log(domain, message) {
        console.log(`[${domain}] ${message}`);
    }
}
exports.default = LoggerUtil;
