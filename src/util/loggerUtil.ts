class LoggerUtil {
    static info(domain: string, message: string): void {
        // TODO: Enhance logging
        console.log(`[${domain}] ${message}`)
    }

    static error(domain: string, message: string): void {
        console.error(`ERROR [${domain}] ${message}`)
    }
}

export default LoggerUtil
