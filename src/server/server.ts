import express from 'express';
import cors from 'cors'
import {BaseController} from "../shared/controllers/base.controller";
import {errorHandlerMiddleware} from "../shared/middlewares/errorHandler.middleware";
import {serverMiddleware} from "../shared/middlewares/server.middleware";
import { ConfigFactory } from '../configs/factories/config.factory';

import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import helmet from "helmet";

export class Server {
    public app: express.Application
    public port: number;

    constructor(port, controllers: BaseController[]) {
        this.app = express();
        this.app.use(helmet());
        this.app.use(serverMiddleware);

        this.port = port;

        this.app.use(bodyParser.json({limit: "100mb"}));
        this.app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:50000}));

        this.app.use(express.json());
        this.app.use(cors());

        this.initControllers(controllers);
        this.app.use(errorHandlerMiddleware);
    }

    public listen() {
        return this.app.listen(this.port, () => {
            console.info(`${ConfigFactory.getConfig().serverName} listening on the port ${this.port}`);
        });
    }

    private initControllers(controllers: BaseController[]) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }
}
