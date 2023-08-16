import { BaseController } from "../../shared/controllers/base.controller";
import { BaseControllerInterface } from "../../shared/controllers/base.controller.interface";
import { AuthService } from "./auth.service";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AuthResponse, LoginUser, RegisterUser } from "./auth.model";
import express from "express";

export class AuthController extends BaseController{
    path = '/auth';

    constructor(private authService: AuthService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
    }

    /**
     * @swagger
     * /auth/login:
     *  post:
     *      tags:
     *          - Auth
     *      description: Login user
     *      requestBody:
     *          required: true
     *          description: Login user into application
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#/definitions/LoginUser'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     *
     * @param req
     * @param res
     * @param next
     */
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