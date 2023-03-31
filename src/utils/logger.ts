import { createLogger, transports, LoggerOptions, format } from 'winston';
const { timestamp, combine, errors, json, colorize, label, printf } = format;

const warnFilter = format((info) => {
  return info.level.includes('warn') ? info : false;
});

const errorFilter = format((info) => {
  return info.level.includes('error') ? info : false;
});

const myFormat = printf((info) => {
  return `[${info.label}] ${info.timestamp} | ${info.level}: ${info.message}`;
});

const logConfiguration: LoggerOptions = {
  level: 'silly',
  transports: [
    new transports.Console({ level: 'silly' }),
    new transports.File({
      filename: './logs/error-logging.log',
      level: 'error',
      format: combine(errorFilter(), myFormat)
    }),
    new transports.File({
      filename: './logs/warns-logging.log',
      level: 'warn',
      format: combine(warnFilter(), myFormat)
    }),
    new transports.File({
      filename: './logs/info-logging.log',
      level: 'info',
      format: combine(myFormat)
    })
  ],
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    label({ label: 'Kwik-E-Mart-Backend' }),
    myFormat
  )
};

export const Logger = createLogger(logConfiguration);
