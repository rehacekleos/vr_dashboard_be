import { BaseController } from "../../shared/controllers/base.controller";
import { OrganisationService } from "../organisation/organisation.service";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { ApplicationService } from "./application.service";
import { AuthMiddlewareResponse, OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express, { application } from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { Application, NewApplication } from "./application.model";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";

export class ApplicationController extends BaseController{
    path = '/application';

    constructor(private applicationService: ApplicationService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getApplications);
        this.router.get('/:id', [authMiddleware], this.getApplication);
        this.router.post('/', [authMiddleware, organisationMiddleware], this.createApplication);
        this.router.put('/:id/settings', [authMiddleware], this.updateSettings);
        this.router.delete('/:id', [authMiddleware], this.deleteApplication);
    }

    getApplications = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const result = await this.applicationService.getApplicationsForOrganisation(orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    getApplication = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const applicationId = req.params.id;
            const result = await this.applicationService.getApplication(applicationId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    createApplication = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const app: NewApplication = req.body;
            const result = await this.applicationService.createApplication(app, orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot create application.', e));
        }
    };

    updateSettings = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const applicationId = req.params.id;
            const setting: any = req.body;
            const result = await this.applicationService.updateSetting(applicationId, setting);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot update setting.', e));
        }
    };

    deleteApplication = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const applicationId = req.params.id;
            const result = await this.applicationService.deleteApplication(applicationId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot delete application.', e));
        }
    };
}