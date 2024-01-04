import { CollectionName } from '../shared/repositories/mongoDb/collectionName.enum';
import { ServerType } from '../shared/enums/serverType.enum';
import { MongoDbType } from '../shared/repositories/mongoDb/strategies/mongoDb.strategy.factory';

/**
 * Model of base configuration
 */
export class BaseConfigModel{
    /** Name of the server */
    serverName: string;
    /** Version of application */
    version: string;
    /** Port on which to run the application */
    defaultPort: number;
    /** The number of instances of the application to be run */
    defaultWorkers: number;
    /** JWT token secret*/
    jwtSecret: string;
    /** JWT token issuer */
    jwtIssuer: string;
    /** Type of server */
    serverType: ServerType;
    /** Connection string to database */
    dbUrl: string;
    /** Type of database */
    mongoDbType: MongoDbType;
    /** Name of database */
    mongoDbDatabase: string;
    /** Array of database collections */
    mongoDbCollections: CollectionName[];
}

/**
 * Model of environmental configuration
 */
export class ConfigModel{

}