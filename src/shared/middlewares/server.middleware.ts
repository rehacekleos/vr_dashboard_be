import express from "express";
import { ConfigFactory } from '../../configs/factories/config.factory';

export function serverMiddleware(request: express.Request, response: express.Response, next) {
    response.set('Server', ConfigFactory.getConfig().serverName);
    next();
}
