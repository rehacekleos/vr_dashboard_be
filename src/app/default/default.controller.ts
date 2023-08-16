import { BaseController } from "../../shared/controllers/base.controller";
import { ConfigFactory } from '../../configs/factories/config.factory';
import { MongoDbConnection } from '../../shared/repositories/mongoDb/mongoDb.connection';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerJSDocOptions } from "../../swagger/definitions";

export class DefaultController extends BaseController {
    path = '/';

    swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

    constructor() {
        super()
        this.initRouter()
    }

    initRouter(): void {
        this.router.get('/', this.indexHandler);
        this.router.get('/health-check', this.getHealthCheck);
        this.router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec))
    }

    indexHandler = async (req, res) => {
        res.redirect('/api/docs');
    };

    /**
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
