"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerUtil {
    static log(domain, message) {
        // TODO: Enhance logging
        console.log(`[${domain}] ${message}`);
    }
}
exports.default = LoggerUtil;
