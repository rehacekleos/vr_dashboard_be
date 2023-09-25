import { BaseController } from "../../shared/controllers/base.controller";
import { ActivityService } from "../activity/activity.service";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AdminService } from "./admin.service";
import { adminMiddleware } from "../../shared/middlewares/admin.middleware";

export class AdminController extends BaseController {
    path = '/admin'

    constructor(private adminService: AdminService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/applications', [authMiddleware, adminMiddleware], this.getAllApplications)
    }

    getAllApplications = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const result = await this.adminService.getAllApplications();
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