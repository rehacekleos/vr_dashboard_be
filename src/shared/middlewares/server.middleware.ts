import express from "express";
import { ConfigFactory } from '../../configs/config.factory';

/**
 * Middleware that adds server information to the http header.
 * @param request HTTP request
 * @param response HTTP response
 * @param next Parse data to flow
 */
export function serverMiddleware(request: express.Request, response: express.Response, next) {
    response.set('Server', ConfigFactory.getConfig().serverName);
    next();
}
