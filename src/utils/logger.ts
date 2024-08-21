import winston from 'winston';

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

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const transports = [
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.File({ filename: 'logs/console.log', format: consoleFormat }));
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: fileFormat,
  transports,
});

const log = {
  error: (message: string) => logger.error(message),
  warn: (message: string) => logger.warn(message),
  info: (message: string) => logger.info(message),
  http: (message: string) => logger.http(message),
  debug: (message: string) => logger.debug(message),
};

export default log;