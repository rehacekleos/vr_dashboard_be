export class HttpException extends Error {
    public status?: number;
    public message: string;
    public error?: Error;


    constructor(status: number, message: string, error?: Error) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error;
    }
}
