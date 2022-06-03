"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(name, statusCode) {
        super(name);
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
