import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/env';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

winston.addColors(customLevels.colors);

const fileFormat = format.combine(format.timestamp(), format.json());

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

const fileErrorTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
});

const fileCombinedTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
});

const consoleTransport = new transports.Console({
  format: consoleFormat,
  level: 'debug',
});

const loggerTransports: winston.transport[] = [
  fileErrorTransport,
  fileCombinedTransport,
];

if (process.env.NODE_ENV !== 'production') {
  loggerTransports.push(consoleTransport);
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: config.logLevel || 'info',
  format: fileFormat,
  transports: loggerTransports,
  exitOnError: false,
});

const log = {
  error: (message: string, meta = {}) => logger.error(message, meta),
  warn: (message: string, meta = {}) => logger.warn(message, meta),
  info: (message: string, meta = {}) => logger.info(message, meta),
  http: (message: string, meta = {}) => logger.http(message, meta),
  debug: (message: string, meta = {}) => logger.debug(message, meta),
};

export default log;
