import { BaseController } from "../../shared/controllers/base.controller";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { SendActivity } from "../activity/activity.model";
import { PublicService } from "./public.service";

/**
 * Public Controller
 */
export class PublicController extends BaseController{
    path = '/public'

    constructor(private publicService: PublicService) {
        super();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/vr-data/:applicationIdentifier/:orgCode/:activityId', this.getActivityVrData)
        this.router.get('/vr-data/:applicationIdentifier/:orgCode/:activityId/:environmentId', this.getActivityVrData)
        this.router.get('/participants/:applicationIdentifier/:orgCode', this.getParticipants)
        this.router.post('/activity/:applicationIdentifier', this.sendNewActivity)
    }

    /**
     * Handle request for getting VrData
     *
     * @swagger
     *
     * /public/vr-data/{applicationIdentifier}/{orgCode}/{activityId}/{environmentId}:
     *  get:
     *      description: Get Vr Data for activity
     *      tags:
     *        - Public
     *      parameters:
     *        - $ref: '#/parameters/applicationIdentifier'
     *        - $ref: '#/parameters/orgCode'
     *        - $ref: '#/parameters/activityId'
     *        - $ref: '#/parameters/environmentId'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    getActivityVrData = async (req: express.Request, res: express.Response, next) => {
        try {
            const applicationIdentifier = req.params.applicationIdentifier;
            const orgCode = req.params.orgCode;
            const activityId = req.params.activityId;
            const environmentId = req.params.environmentId;
            const result = await this.publicService.getActivityVrData(applicationIdentifier, orgCode, activityId, environmentId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get vr data.', e));
        }
    };

    /**
     * Handle request for getting Participants metadata
     *
     * @swagger
     *
     * /public/participants/{applicationIdentifier}/{orgCode}:
     *  get:
     *      description: Get Participant for Organisation
     *      tags:
     *        - Public
     *      parameters:
     *        - $ref: '#/parameters/applicationIdentifier'
     *        - $ref: '#/parameters/orgCode'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    getParticipants = async (req: express.Request, res: express.Response, next) => {
        try {
            const applicationIdentifier = req.params.applicationIdentifier;
            const orgCode = req.params.orgCode;
            const result = await this.publicService.getParticipants(applicationIdentifier, orgCode);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get vr data.', e));
        }
    };

    /**
     * Handle request for sending new Activity
     *
     * @swagger
     *
     * /public/vr-data/{applicationIdentifier}:
     *  post:
     *      description: Send new Activity for application
     *      tags:
     *        - Public
     *      parameters:
     *        - $ref: '#/parameters/applicationIdentifier'
     *        - $ref: '#/parameters/sendActivityBody'
     *      responses:
     *          200:
     *              description: Successful operation
     *          400:
     *               description: Error
     */
    sendNewActivity = async (req: express.Request, res: express.Response, next) => {
        try {
            const applicationIdentifier = req.params.applicationIdentifier;
            const activity: SendActivity = req.body;
            await this.publicService.saveNewActivity(applicationIdentifier, activity);
            res.sendStatus(200);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot save new activity.', e));
        }
    };
}