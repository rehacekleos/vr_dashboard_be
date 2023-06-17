import {HttpException} from "../exceptions/HttpException";
import express, {NextFunction} from "express";

export function errorHandlerMiddleware(error: any, request: express.Request, response: express.Response, next: NextFunction) {
    const message = error.message || 'Something went wrong';
    if (error instanceof HttpException) {
        const status = error?.status;

        const payload = {
            message: message
        }

        if(status !== 401) {
            console.error(error);
        }

        response.status(status).json(payload).send();
    } else {
        const payload = {
            message: message
        }

        console.error(error);

        response.status(500).json(payload).send();
    }
}
