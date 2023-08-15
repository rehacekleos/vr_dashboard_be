import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";
import { OrganisationService } from "./organisation.service";
import { NewOrganisation } from "./organisation.model";

export class OrganisationController extends BaseController {
    path = '/organisation';

    constructor(private organisationService: OrganisationService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/', [authMiddleware], this.getOrganisationsForUser);
        this.router.post('/', [authMiddleware], this.createOrganisation);
    }

    getOrganisationsForUser = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const result = await this.organisationService.getOrganisationsForUser(user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get organisations.', e));
        }
    };

    createOrganisation = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const body: NewOrganisation = req.body;
            const result = await this.organisationService.createOrganisation(body, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get organisations.', e));
        }
    };
}