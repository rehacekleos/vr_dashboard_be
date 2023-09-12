import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { ActivityService } from "./activity.service";

export class ActivityController extends BaseController{
    path = '/activity'

    constructor(private activityService: ActivityService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getActivities)
    }

    getActivities = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const result = await this.activityService.getActivities(orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get activities.', e));
        }
    };
}