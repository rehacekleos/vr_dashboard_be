import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";
import { OrganisationService } from "./organisation.service";
import { NewOrganisation } from "./organisation.model";
import { userInfo } from "os";

export class OrganisationController extends BaseController {
    path = '/organisation';

    constructor(private organisationService: OrganisationService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/', [authMiddleware], this.getOrganisationsForUser);
        this.router.get('/:organisationId', [authMiddleware], this.getOrganisationsById);
        this.router.post('/', [authMiddleware], this.createOrganisation);
        this.router.delete('/:organisationId', [authMiddleware], this.deleteOrganisation);
    }

    /**
     * @swagger
     * /organisation:
     *  get:
     *      description: Get organisations for User
     *      security:
     *        - bearerAuth: []
     *      tags:
     *        - Organisation
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    getOrganisationsForUser = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const result = await this.organisationService.getOrganisationsForUser(user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException) {
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get organisations.', e));
        }
    };

    /**
     * @swagger
     * /organisation/{organisationId}:
     *  get:
     *      description: Get organisation by ID
     *      security:
     *        - bearerAuth: []
     *      tags:
     *        - Organisation
     *      parameters:
     *        - $ref: '#/parameters/organisationId'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    getOrganisationsById = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const orgId = req.params.organisationId
            const result = await this.organisationService.getOrganisationByIdForUser(orgId, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException) {
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
            if (e instanceof HttpException) {
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get organisations.', e));
        }
    };

    /**
     * @swagger
     * /organisation/{organisationId}:
     *  delete:
     *      description: Delete organisation by ID
     *      security:
     *        - bearerAuth: []
     *      tags:
     *        - Organisation
     *      parameters:
     *        - $ref: '#/parameters/organisationId'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    deleteOrganisation = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const orgId = req.params.organisationId
            const result = await this.organisationService.deleteOrganisation(orgId, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException) {
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get organisations.', e));
        }
    };
}