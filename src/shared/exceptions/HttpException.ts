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

export class NoRequiredParameter extends HttpException{
    constructor(parameter: string) {
        super(400, `${parameter} is a required parameter.`);
    }
}

export class BadParameter extends HttpException{
    constructor(parameter: string) {
        super(400, `${parameter} has wrong value.`);
    }
}

export class WrongBody extends HttpException{
    constructor(model: string) {
        super(400, `${model} has wrong body model.`);
    }
}