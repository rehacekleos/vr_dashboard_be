import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { AuthMiddlewareResponse, OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { InvitationService } from "./invitation.service";
import { AcceptInvitation, NewInvitation } from "./invitation.model";

/**
 * Controller for entity Invitation
 */
export class InvitationController extends BaseController{
    /** Controller base route */
    readonly path = "/invitation";

    /**
     * @constructor
     * @param invitationService
     */
    constructor(private invitationService: InvitationService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getInvitations);
        this.router.post('/', [authMiddleware, organisationMiddleware], this.createInvitation);
        this.router.post('/accept', [authMiddleware], this.acceptInvitation);
        this.router.patch('/:invitationId', [authMiddleware, organisationMiddleware], this.extendInvitation);
        this.router.delete('/:invitationId', [authMiddleware, organisationMiddleware], this.deleteInvitation);
    }

    getInvitations = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const result = await this.invitationService.getInvitationsForOrg(orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    createInvitation = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const newInvitation: NewInvitation = req.body;
            const user = req.user;
            const emp = req.employee;
            const result = await this.invitationService.createInvitation(newInvitation, orgId, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    acceptInvitation = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const accept: AcceptInvitation = req.body;
            const result = await this.invitationService.acceptInvitation(accept, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    extendInvitation = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const invitationId: string = req.params.invitationId;
            const user = req.user;
            const emp = req.employee;
            const result = await this.invitationService.extendInvitation(invitationId, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    deleteInvitation = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const invitationId: string = req.params.invitationId;
            const user = req.user;
            const emp = req.employee;
            const result = await this.invitationService.deleteInvitation(invitationId, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };
}