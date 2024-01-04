import express, { NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.util";
import { UserDataAccess } from "../../app/user/user.dataAccess";
import { User } from "../../app/user/user.model";
import { HttpException } from "../exceptions/HttpException";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";

/**
 * Middleware that checks if the http request contains a jwt token and if this token is valid. It also checks if the user specified in the token exists.
 * @param request HTTP request
 * @param response HTTP response
 * @param next Parse data to flow
 */
export async function authMiddleware(request: AuthMiddlewareResponse, response: express.Response, next: NextFunction) {
    const token = request.header('Authorization')

    if (token && token.includes('Bearer ')) {
        try {
            const jwt = token.split(" ")[1]
            const jwtUtils = JwtUtil.getInstance();
            const userDa = UserDataAccess.getInstance();

            let verified: User;

            try {
                verified = jwtUtils.verifyToken<User>(jwt);
            } catch (e) {
                if (e instanceof HttpException){
                    next(e)
                } else {
                    throw e;
                }
            }


            const user = await userDa.getUserByEmail(verified.email);
            if (!user){
                next(new HttpException(401, 'Wrong authentication token.'));
                return;
            }

            request.user = user;
            next()
        } catch (error) {
            next(new HttpException(401, 'Wrong authentication token.'));
        }
    } else {
        next(new HttpException(401, 'Authentication token missing.'));
    }
}