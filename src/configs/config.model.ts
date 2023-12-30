import { CollectionName } from '../shared/repositories/mongoDb/collectionName.enum';
import { ServerType } from '../shared/enums/serverType.enum';
import { MongoDbType } from '../shared/repositories/mongoDb/strategies/mongoDb.strategy.factory';

export class BaseConfigModel{
    serverName: string;
    version: string;
    defaultPort: number;
    defaultWorkers: number;
    jwtSecret: string;
    jwtIssuer: string;
    serverType: ServerType;
    frontendURL: string;
    dbUrl: string;
    mongoDbType: MongoDbType;
    mongoDbDatabase: string;
    mongoDbCollections: CollectionName[];
}

export class ConfigModel{

}