import "dotenv/config";
import winston, { type level } from "winston";
const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
};

let logger = winston.createLogger({
    levels: logLevels,
    level: "info",
    format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        align(),
        printf(
            (info) =>
                `[${info.timestamp}] ${info.level}: ${info.message}  type: ${info.type}  class: ${info.class}`
        )
    ),
    transports: [new winston.transports.Console()],
});

logger.warn("test");
export default logger;
