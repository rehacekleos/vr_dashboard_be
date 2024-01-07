import { BaseController } from "../../shared/controllers/base.controller";
import { AuthService } from "./auth.service";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AuthResponse, LoginUser, RegisterUser } from "./auth.model";
import express from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";

/**
 * Controller for authorization
 */
export class AuthController extends BaseController{
    /** Controller base route */
    readonly path = '/auth';

    /**
     * @constructor
     * @param authService
     */
    constructor(private authService: AuthService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
        this.router.get('/information', [authMiddleware], this.getInformation);
    }

    login = async (req: express.Request, res: express.Response, next) => {
        try {
            const login: LoginUser = req.body
            const result: AuthResponse = await this.authService.login(login);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot login user.', e));
        }
    };

    getInformation = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            res.status(200).json(user);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot login user.', e));
        }
    };

    register = async (req: express.Request, res: express.Response, next) => {
        try {
            const register: RegisterUser = req.body;
            const result: AuthResponse = await this.authService.register(register);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot register user.', e));
        }
    };
}