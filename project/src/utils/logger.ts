/**
 * Production-safe logging utility
 * Logs only in development mode and can be extended with external services
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
    // In production, you could send to error tracking service
  },

  /**
   * Log error messages
   */
  error: (message: string, error?: any, ...args: any[]) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error);
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },

  /**
   * Log success messages (development only)
   */
  success: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[SUCCESS] ${message}`, ...args);
    }
  },
};

export default logger;
