import { BaseController } from "../../shared/controllers/base.controller";
import { ApplicationService } from "../application/application.service";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { ParticipantService } from "./participant.service";
import { AuthMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { NewApplication } from "../application/application.model";
import { NewParticipant, Participant } from "./participant.model";

export class ParticipantController extends BaseController{
    path = '/participant';

    constructor(private participantService: ParticipantService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/:id', [authMiddleware], this.getParticipant);
        this.router.post('/', [authMiddleware], this.createParticipant);
        this.router.put('/', [authMiddleware], this.updateParticipant);
        this.router.delete('/:id', [authMiddleware], this.deleteParticipant);
    }

    getParticipant = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const participantId = req.params.id;
            const result = await this.participantService.getParticipantById(participantId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get application.', e));
        }
    };

    createParticipant = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const participant: NewParticipant = req.body;
            const result = await this.participantService.createParticipant(participant, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot create application.', e));
        }
    };

    updateParticipant = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const participant: Participant = req.body;
            const result = await this.participantService.updateParticipant(participant, user);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot update setting.', e));
        }
    };

    deleteParticipant = async (req: AuthMiddlewareResponse, res: express.Response, next) => {
        try {
            const user = req.user;
            const participantId = req.params.id;
            const result = await this.participantService.deleteParticipant(participantId, user);
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