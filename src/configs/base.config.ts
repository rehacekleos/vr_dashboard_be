import { BaseConfigModel } from './models/config.model';
import { ServerType } from '../shared/enums/serverType.enum';
import { MongoDbType } from '../shared/repositories/mongoDb/strategies/mongoDb.strategy.factory';

export const baseConfig: BaseConfigModel =  {
    serverName: "Server",
    version: '1.0.0',
    defaultPort: Number(process.env.PORT) || 8080,
    defaultWorkers: Number(process.env.WORKERS) || 1,
    serverType: process.env.SERVER_TYPE ? ServerType[process.env.SERVER_TYPE] : ServerType.DEFAULT,
    frontendURL: process.env.FRONTEND_URL,
    dbUrl: process.env.DB_URL,
    mongoDbType: process.env.MONGO_DB_TYPE ? MongoDbType[process.env.MONGO_DB_TYPE]: MongoDbType.MONGODB,
    mongoDbDatabase: process.env.MONGO_DB_DATABASE,
    mongoDbCollections: [],
}