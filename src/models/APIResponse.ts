export class APIResponse{
    statusCode: number;
    error: string;
    message: string;
    errorCode: string

    constructor(statusCode: number, error: string, message: string){
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.errorCode = "17645_err"
    }
}

// {
//     "statusCode": 401,
//     "error": "Unauthorized",
//     "message": "Missing authentication"
// }