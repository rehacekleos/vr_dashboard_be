import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AdminService } from "./admin.service";
import { adminMiddleware } from "../../shared/middlewares/admin.middleware";

/**
 * Controller for Administrators
 */
export class AdminController extends BaseController {
    /** Controller base route */
    readonly path = '/admin'

    /**
     * @constructor
     * @param adminService
     */
    constructor(private adminService: AdminService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/applications', [authMiddleware, adminMiddleware], this.getAllApplications)
        this.router.get('/organisations', [authMiddleware, adminMiddleware], this.getAllOrganisations)
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

    getAllOrganisations = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const result = await this.adminService.getAllOrganisations();
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