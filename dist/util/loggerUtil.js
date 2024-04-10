"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerUtil {
    static info(domain, message) {
        // TODO: Enhance logging
        console.log(`[${domain}] ${message}`);
    }
    static error(domain, message) {
        console.error(`ERROR [${domain}] ${message}`);
    }
}
exports.default = LoggerUtil;
