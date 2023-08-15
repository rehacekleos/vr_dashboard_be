import express, { NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.util";
import { UserDataAccess } from "../../app/user/user.dataAccess";
import { User } from "../../app/user/user.model";
import { HttpException } from "../exceptions/HttpException";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";

export async function authMiddleware(request: AuthMiddlewareResponse, response: express.Response, next: NextFunction) {
    const token = request.header('Authorization')

    if (token && token.includes('Bearer ')) {
        try {
            const jwt = token.split(" ")[1]
            const jwtUtils = JwtUtil.getInstance();
            const userDa = UserDataAccess.getInstance();
            const verified = jwtUtils.verifyToken<User>(jwt);

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