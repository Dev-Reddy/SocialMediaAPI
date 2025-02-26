import winston from "winston";

// create a logger instance
// it will log - level, message, timestamp, reqUrl

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "request-logging" },
  format: winston.format.combine(
    winston.format.printf(({ level, message, timestamp, reqUrl }) => {
      return JSON.stringify({
        level,
        timestamp,
        message,
        reqUrl,
      });
    })
  ),
  transports: [
    new winston.transports.File({
      filename: "logs.log",
    }),
  ],
});

// create a middleware function

const loggerMiddleware = async (req, res, next) => {
  // log the request
  if (!req.url.includes("user")) {
    logger.log({
      level: "info",
      message: "Incoming request",
      reqUrl: req.url,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

export default loggerMiddleware;
