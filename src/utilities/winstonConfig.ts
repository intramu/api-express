import "dotenv/config";
import winston from "winston";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
};

/**
 * Customized winston logger that currently prints message to console
 */
const logger = winston.createLogger({
    levels: logLevels,
    level: "verbose",
    format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        align(),
        printf(
            (info) =>
                `[${info.timestamp}] ${info.level}: ${info.message}  type: ${info.type}  class: ${
                    !info.class ? "[N/A]" : info.class
                }\n\tvalues: ${!info.values ? "[N/A]" : info.values}\n\ttrace: ${
                    !info.trace ? "[N/A]" : info.trace
                }`
        )
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
