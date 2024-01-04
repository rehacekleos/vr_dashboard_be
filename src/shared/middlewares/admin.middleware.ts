import { AuthMiddlewareResponse } from "../../models/middlewares.model";
import express, { NextFunction } from "express";
import { isEmptyAndNull } from "../utils/common.util";
import { HttpException } from "../exceptions/HttpException";

/**
 * Middleware that checks if the user is a superAdmin or a developer
 * @param request HTTP request
 * @param response HTTP response
 * @param next Parse data to flow
 */
export async function adminMiddleware(request: AuthMiddlewareResponse, response: express.Response, next: NextFunction) {
    const user = request.user;

    if (!isEmptyAndNull(user) && (user.superAdmin === true || user.developer === true)) {
        next()
    } else {
        next(new HttpException(401, "The user is not an admin."));
    }
}