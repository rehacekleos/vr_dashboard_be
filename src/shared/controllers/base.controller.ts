import express, { Router } from 'express';
import { BaseControllerInterface } from './base.controller.interface';

/**
 * Base controller
 */
export class BaseController implements BaseControllerInterface{
    /** route for controller */
    readonly path: string = '/';

    /** express.js router */
    router: Router = express.Router();

    constructor() {
    }

    initRouter() {}

}
