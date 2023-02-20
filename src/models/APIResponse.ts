export class APIResponse {
    statusCode: number;

    error: string;

    message: string;

    errorCode: string | null;

    public constructor(message: string, errorCode?: string | null) {
        this.errorCode = errorCode ?? "";
        this.message = message;
        this.statusCode = 0;
        this.error = "";
    }

    // Constructors
    static Unauthorized(message?: string, errorCode?: string) {
        const x = new APIResponse("", errorCode);

        x.statusCode = 401;
        x.error = "Unauthorized";
        x.message = message ?? "Not permitted to access";

        return x;
    }

    static BadRequest(message: string, errorCode?: string) {
        const x = new APIResponse(message, errorCode);

        x.statusCode = 400;
        x.error = "Bad Request";
        x.message = `Payload validation error: ${message}`;

        return x;
    }

    static Forbidden(message: string, errorCode?: string) {
        const x = new APIResponse(message, errorCode);

        x.statusCode = 403;
        x.error = "Forbidden";

        return x;
    }

    static NotFound(message: string, errorCode?: string) {
        const x = new APIResponse(message, errorCode);

        x.statusCode = 404;
        x.error = "Not Found";

        return x;
    }

    static Conflict(message: string, errorCode?: string) {
        const x = new APIResponse(message, errorCode);

        x.statusCode = 409;
        x.error = "Conflict";

        return x;
    }

    static InternalError(message: string, errorCode?: string) {
        const x = new APIResponse(message, errorCode);

        x.statusCode = 500;
        x.error = "Interal Server Error";

        return x;
    }

    static NotImplemented() {
        const x = new APIResponse("", null);

        x.statusCode = 501;
        x.error = "Not Implemented";

        return x;
    }
}
