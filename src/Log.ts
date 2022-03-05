
type Console = typeof console

/**
 * This class' sole purpose is to avoid cluttering the codebase with `eslint-disable-line no-console` comments
 *
 * When using this class to log errors or messages, one can assume it's intentional and principled.
 */
class Log {
  constructor (private readonly namespace?: string) {}

  /**
   * The log method's generic typing allows it to only accept
   *
   * @param method - log
   * @param args
   */
  private log<M extends Extract<keyof Console, keyof Omit<Log, 'log'>>>(method: M, ...args: Parameters<Console[M]>) {
    const [msg, ...optionalParams] = args
    const prefix = this.namespace != null ? `${this.namespace}.${method}: ` : ''

    // eslint-disable-next-line no-console
    console[method](`${prefix}${msg as string}`, ...optionalParams)
  }

  debug (...args: Parameters<Console['debug']>) {
    this.log('debug', ...args)
  }

  info (...args: Parameters<Console['info']>) {
    this.log('info', ...args)
  }

  warn (...args: Parameters<Console['warn']>) {
    this.log('warn', ...args)
  }

  error (...args: Parameters<Console['error']>) {
    this.log('error', ...args)
  }
}

export { Log }
