import {BaseController} from "../../shared/controllers/base.controller";
import { ConfigFactory } from '../../configs/factories/config.factory';
import { MongoDbConnection } from '../../shared/repositories/mongoDb/mongoDb.connection';
import { DefaultService } from './default.service';
import { HttpException } from '../../shared/exceptions/HttpException';

export class DefaultController extends BaseController {
    path = '/';

    constructor(private defaultService: DefaultService) {
        super()
        this.initRouter()
    }

    initRouter(): void {
        this.router.get('/', this.indexHandler);
        this.router.get('/health-check', this.getHealthCheck);
        this.router.get('/default', this.defaultGet);
    }

    indexHandler = async (req, res) => {
        const page = ConfigFactory.getConfig().frontendURL;
        res.redirect(page);
    };

    getHealthCheck = async (req, res) => {
        if (MongoDbConnection.isConnected === false) {
            res.status(500).send('Mongo DB is not connected');
            return;
        }
        res.status(200).send(`${ConfigFactory.getConfig().serverName} is running on version: ${ConfigFactory.getConfig().version}`);
    };

    defaultGet = async (req, res, next) => {
        try {
            const list = await this.defaultService.defaultGet();
            res.status(200).json(list);
        } catch (e) {
            next(new HttpException(400, 'Cannot get default.', e));
        }
    };
}
