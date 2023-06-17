import express from 'express';
import { BaseControllerInterface } from './base.controller.interface';

export class BaseController implements BaseControllerInterface{
    path = '/';
    router = express.Router();

    constructor() {
    }

    initRouter() {}

}
