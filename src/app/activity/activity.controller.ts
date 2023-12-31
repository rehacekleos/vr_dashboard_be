import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { ActivityService } from "./activity.service";
import { NewActivity } from "./activity.model";

/**
 * Controller for entity Activity
 */
export class ActivityController extends BaseController{
    /** Controller base route */
    readonly path = '/activity'

    /**
     * @constructor
     * @param activityService
     */
    constructor(private activityService: ActivityService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getActivities)
        this.router.get('/:id', [authMiddleware, organisationMiddleware], this.getActivity)
        this.router.get('/participant/:participantId', [authMiddleware, organisationMiddleware], this.getActivitiesForParticipant)
        this.router.patch('/:id/note', [authMiddleware, organisationMiddleware], this.updateActivityNote)
        this.router.post('/', [authMiddleware, organisationMiddleware], this.createActivity)
        this.router.delete('/:id', [authMiddleware, organisationMiddleware], this.deleteActivity)
    }

    getActivities = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const filters = req.query as any;
            const user = req.user;
            const emp = req.employee;
            const result = await this.activityService.getActivities(orgId, filters, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get activities.', e));
        }
    };

    getActivity = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const activityId = req.params.id;
            const result = await this.activityService.getActivity(activityId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get activities.', e));
        }
    };

    getActivitiesForParticipant = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const participantId = req.params.participantId;
            const result = await this.activityService.getActivitiesForParticipant(participantId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get activities.', e));
        }
    };

    createActivity = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const body: NewActivity = req.body;
            const result = await this.activityService.createActivity(body, orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot create activity.', e));
        }
    };

    updateActivityNote = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const activityId = req.params.id;
            const newNote: string = req.body?.note;
            const result = await this.activityService.updateActivityNote(activityId, newNote);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot update activity.', e));
        }
    };

    deleteActivity = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const activityId = req.params.id;
            const result = await this.activityService.deleteActivity(activityId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot update activity.', e));
        }
    };
}