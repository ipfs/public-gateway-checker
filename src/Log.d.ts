type Console = typeof console;
/**
 * This class' sole purpose is to avoid cluttering the codebase with `eslint-disable-line no-console` comments
 *
 * When using this class to log errors or messages, one can assume it's intentional and principled.
 */
declare class Log {
    private readonly namespace?;
    constructor(namespace?: string | undefined);
    /**
     * The log method's generic typing allows it to only accept
     *
     * @param method - log
     * @param args
     */
    private log;
    debug(...args: Parameters<Console['debug']>): void;
    info(...args: Parameters<Console['info']>): void;
    warn(...args: Parameters<Console['warn']>): void;
    error(...args: Parameters<Console['error']>): void;
}
export { Log };
//# sourceMappingURL=Log.d.ts.map