/**
 * This class' sole purpose is to avoid cluttering the codebase with `eslint-disable-line no-console` comments
 *
 * When using this class to log errors or messages, one can assume it's intentional and principled.
 */
class Log {
    namespace;
    constructor(namespace) {
        this.namespace = namespace;
    }
    /**
     * The log method's generic typing allows it to only accept
     *
     * @param method - log
     * @param args
     */
    log(method, ...args) {
        const [msg, ...optionalParams] = args;
        const prefix = this.namespace != null ? `${this.namespace}.${method}: ` : '';
        // eslint-disable-next-line no-console
        console[method](`${prefix}${msg}`, ...optionalParams);
    }
    debug(...args) {
        this.log('debug', ...args);
    }
    info(...args) {
        this.log('info', ...args);
    }
    warn(...args) {
        this.log('warn', ...args);
    }
    error(...args) {
        this.log('error', ...args);
    }
}
export { Log };
//# sourceMappingURL=Log.js.map