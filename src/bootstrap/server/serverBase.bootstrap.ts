// Base bootstrap class for server init.
// This class contains all shared operations with basic implementation for both subclasses.
// Do not use this class directly. Use it as parent class.
// Cloud version is used as base version, so little changes in cloud subclass.
import {IServerInstances} from "../interfaces/IServerInstances";
import {Server} from "../../server/server";
import express from 'express';
import {DefaultController} from "../../app/default/default.controller";
import { ConfigFactory } from '../../configs/factories/config.factory';
import { DefaultService } from '../../app/default/default.service';
import { AuthService } from "../../app/auth/auth.service";
import { AuthController } from "../../app/auth/auth.controller";

export class ServerBaseBootstrap {

    protected workers: number;
    protected server: Server;

    /**
     * Define services
     */
    private defaultService = new DefaultService();
    private authService = new AuthService();



    /**
     * Define controllers
     */
    private controllers = [
        new DefaultController(this.defaultService),
        new AuthController(this.authService),
    ]

    constructor() {
        this.workers = ConfigFactory.getConfig().defaultWorkers;
    }

    /**
     * Function that serves as a template for server init.
     * @protected
     *
     * @returns {Promise<IServerInstances>} Return value is promise due to async character of the method.
     */
    protected async start():Promise<IServerInstances>{return;}

    /**
     * Base method for server init derivative from old cloud settings.
     * @protected
     *
     * @returns {express.Application}
     */
    protected initServer(): express.Application {
        const port = ConfigFactory.getConfig().defaultPort;

        this.server = new Server(port, this.controllers);

        this.server.listen();
        return this.server.app;
    }
}
