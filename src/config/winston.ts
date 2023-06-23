import stream from "stream";
import winston from "winston";

export const streamWriter = {
  write: (message: any) => logger.info(message),
};

const options = {
  file: {
    level: "info",
    filename: "logs/app.log",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

logger.stream = (options?: any) => new stream.Duplex(streamWriter);

export default logger;
