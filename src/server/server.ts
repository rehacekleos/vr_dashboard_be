import express from 'express';
import cors from 'cors'
import {BaseController} from "../shared/controllers/base.controller";
import {errorHandlerMiddleware} from "../shared/middlewares/errorHandler.middleware";
import {serverMiddleware} from "../shared/middlewares/server.middleware";
import { ConfigFactory } from '../configs/factories/config.factory';

import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";

export class Server {
    public app: express.Application
    public port: number;

    constructor(port, controllers: BaseController[]) {
        this.app = express();
        this.app.use(cors());
        this.app.use(serverMiddleware);
        this.port = port;

        this.app.use(bodyParser.json({limit: "100mb"}));
        this.app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:50000}));

        this.app.use(express.json());

        this.setAppJsDocs();

        this.setWebGLModuleHosting();

        this.initControllers(controllers);
        this.app.use(errorHandlerMiddleware);
    }

    /**
     * Setting JSDocs on /docs endpoint
     * @private
     */
    private setAppJsDocs(){
        this.app.use("/docs", express.static(path.resolve(__dirname , "../../docs")));
    }

    /**
     * Setting hosting for WebGL application modules
     *
     * Modules are available at /public/modules/:applicationId/:moduleVersion endpoint
     * @private
     *
     * @swagger
     *
     * /public/modules/{applicationId}/{moduleVersion}:
     *  get:
     *      description: Return WebGL application module for browser
     *      tags:
     *          - Public
     */
    private setWebGLModuleHosting(){
        this.app.use("/public/modules/:applicationId/:moduleVersion/*", (req, res, next) => {

            let applicationId = req.params.applicationId
            let moduleVersion = req.params.moduleVersion
            let assets = ""
            if (req.params[0]){
                assets = `/${req.params[0]}`;
            }

            express.static(path.resolve(__dirname, `../../public/modules/${applicationId}/${moduleVersion}${assets}`), {
                setHeaders: (res, path) => {
                    if (path.endsWith(".gz")) {
                        // add a HTTP response header for gzip
                        res.set("Content-Encoding", "gzip");
                    }
                    if (path.includes("wasm")) {
                        // add a HTTP response header for wasm
                        res.set("Content-Type", "application/wasm");
                    }
                }
            })(req, res, next);
        });
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
