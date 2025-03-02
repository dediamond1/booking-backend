import { format } from 'date-fns';
import { Request } from 'express';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
  tenant?: string;
  context?: Record<string, unknown>;
  stack?: string;
}

class Logger {
  private static formatTimestamp(): string {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  }

  private static createLog(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogMessage {
    const log: LogMessage = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
    };

    if (error) {
      log.stack = error.stack;
    }

    return log;
  }

  static debug(message: string, context?: Record<string, unknown>) {
    const log = this.createLog('debug', message, context);
    console.debug(JSON.stringify(log));
  }

  static info(message: string, context?: Record<string, unknown>) {
    const log = this.createLog('info', message, context);
    console.info(JSON.stringify(log));
  }

  static warn(message: string, context?: Record<string, unknown>) {
    const log = this.createLog('warn', message, context);
    console.warn(JSON.stringify(log));
  }

  static error(message: string, error?: Error, context?: Record<string, unknown>) {
    const log = this.createLog('error', message, context, error);
    console.error(JSON.stringify(log));
  }

  static withTenantContext(req: Request) {
    return {
      debug: (message: string, context?: Record<string, unknown>) => {
        const tenantId = req.tenant?.id;
        this.debug(message, { ...context, tenantId });
      },
      info: (message: string, context?: Record<string, unknown>) => {
        const tenantId = req.tenant?.id;
        this.info(message, { ...context, tenantId });
      },
      warn: (message: string, context?: Record<string, unknown>) => {
        const tenantId = req.tenant?.id;
        this.warn(message, { ...context, tenantId });
      },
      error: (message: string, error?: Error, context?: Record<string, unknown>) => {
        const tenantId = req.tenant?.id;
        this.error(message, error, { ...context, tenantId });
      },
    };
  }
}

export default Logger;
