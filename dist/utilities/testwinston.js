"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, align } = winston_1.default.format;
require("dotenv/config");
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
console.log(process.env.LOG_LEVEL);
const newLogger = winston_1.default.createLogger({
    level: "info",
    levels: logLevels,
    format: combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), align(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}  type: ${info.type}  class: ${info.class}`)),
    transports: [new winston_1.default.transports.Console()],
});
exports.default = newLogger;
