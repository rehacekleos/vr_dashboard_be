// Base bootstrap class for server init.
// This class contains all shared operations with basic implementation for both subclasses.
// Do not use this class directly. Use it as parent class.
// Cloud version is used as base version, so little changes in cloud subclass.
import {IServerInstances} from "../interfaces/IServerInstances";
import {Server} from "../../server/server";
import express from 'express';
import { ConfigFactory } from '../../configs/factories/config.factory';
import { AuthService } from "../../app/auth/auth.service";
import { AuthController } from "../../app/auth/auth.controller";
import { OrganisationService } from "../../app/organisation/organisation.service";
import { OrganisationController } from "../../app/organisation/organisation.controller";

export class ServerBaseBootstrap {

    protected workers: number;
    protected server: Server;

    /**
     * Define services
     */
    private authService = new AuthService();
    private organisationService = new OrganisationService();



    /**
     * Define controllers
     */
    private controllers = [
        new AuthController(this.authService),
        new OrganisationController(this.organisationService)
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
