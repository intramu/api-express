export class CustomError extends Error {
    statusCode: number;

    constructor(name: string, statusCode: number) {
        super(name);

        this.statusCode = statusCode;
    }
}
