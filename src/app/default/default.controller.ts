import { BaseController } from "../../shared/controllers/base.controller";
import { ConfigFactory } from '../../configs/factories/config.factory';
import { MongoDbConnection } from '../../shared/repositories/mongoDb/mongoDb.connection';
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerJSDocOptions } from "../../swagger/definitions";

/**
 * Default Controller
 */
export class DefaultController extends BaseController {
    path = '/';

    swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

    swaggerOptions: SwaggerOptions = {
        operationsSorter: (a: any, b: any) => {
            const methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
            let result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));

            if (result === 0) {
                result = a.get("path").localeCompare(b.get("path"));
            }

            return result;
        }
    }

    constructor() {
        super()
        this.initRouter()
    }

    initRouter(): void {
        this.router.get('/', this.indexHandler);
        this.router.get('/health-check', this.getHealthCheck);

        /**
         * @swagger
         *
         * /api/docs:
         *  get:
         *      description: Return swagger page.
         *      tags:
         *          - Default
         */
        this.router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec, {swaggerOptions: this.swaggerOptions}))
    }

    /**
     * Redirect user to /api/docs
     * @param req
     * @param res
     */
    indexHandler = async (req, res) => {
        res.redirect('/api/docs');
    };

    /**
     * Returning health of the server
     *
     * @swagger
     *
     * /health-check:
     *  get:
     *      description: Check if server is connected to Database
     *      tags:
     *          - Default
     *      responses:
     *          200:
     *              description: Server is running and connecting to DB
     *          500:
     *              description: Server is not connected to DB
     */
    getHealthCheck = async (req, res) => {
        if (MongoDbConnection.isConnected === false) {
            res.status(500).send('Mongo DB is not connected');
            return;
        }
        res.status(200).send(`${ConfigFactory.getConfig().serverName} is running on version: ${ConfigFactory.getConfig().version}`);
    };

}
