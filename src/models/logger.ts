/**
 * Logger class for... logging purposes
 */
class Logger {
  /**
   * Whatever it's passed to logger will be console.log'ed if the API instance is set to `debug:true`
   */
  log(...args: any[]) {
    console.log('[BMWStatus]:', ...args);
  }
}

export const logger = new Logger();
