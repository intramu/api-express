export class APIResponse {
    statusCode: number;
    error: string;
    message: string;
    errorCode: string | null;

    public constructor(message: string, errorCode?: string | null) {
        if (errorCode !== undefined) {
            this.errorCode = errorCode;
        }

        this.errorCode = null;
        this.message = message;
        this.statusCode = 0;
        this.error = "";
    }

    // Constructors
    static 400(message: string, errorCode?: string | null) {
        let x = new APIResponse(message, errorCode);

        x.statusCode = 400;
        x.error = "Bad Request";
        x.message = "Payload validation error: " + message;

        return x;
    }

    static 403(message: string, errorCode?: string | null) {
        let x = new APIResponse(message, errorCode);

        x.statusCode = 403;
        x.error = "Forbidden";

        return x;
    }

    static 404(message: string, errorCode?: string | null) {
        let x = new APIResponse(message, errorCode);

        x.statusCode = 404;
        x.error = "Not Found";

        return x;
    }

    static 409(message: string, errorCode?: string | null) {
        let x = new APIResponse(message, errorCode);

        x.statusCode = 409;
        x.error = "Conflict";

        return x;
    }

    static 500(message: string, errorCode?: string | null) {
        let x = new APIResponse(message, errorCode);

        x.statusCode = 500;
        x.error = "Interal Server Error";

        return x;
    }

    static 501() {
        let x = new APIResponse("", null);

        x.statusCode = 501;
        x.error = "Not Implemented";

        return x;
    }
}

// {
//     "statusCode": 401,
//     "error": "Unauthorized",
//     "message": "Missing authentication"
// }
