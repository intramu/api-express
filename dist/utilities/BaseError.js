"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    // description: string;
    constructor($name, $statusCode, $description) {
        super($description);
        // (this.name = $name),
        this.statusCode = $statusCode;
        // this.description = $description;
        // Error.captureStackTrace(this);
    }
}
exports.CustomError = CustomError;
