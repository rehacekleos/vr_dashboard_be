import {MongoDbStrategy} from "./mongoDb.strategy";
import { ConfigFactory } from '../../../../configs/factories/config.factory';

export enum MongoDbType{
    COSMOSDB = 'COSMOSDB',
    DOCUMENTDB = 'DOCUMENTDB',
    MONGODB = 'MONGODB'
}

export interface mongoDbIndex {
    name?: string;
    names?: string[]
    collection: string;
    type: DatabaseIndexType;
    value?: any;
    drop?: boolean;
}

export const enum DatabaseIndexType{
    STANDARD = 'STANDARD',
    TTL = 'TTL',
    COMPOUND = 'COMPOUND'
}


export class MongoDbStrategyFactory {
    public static getDbStrategy(){

        const mongoDbType = MongoDbType[ConfigFactory.getConfig().mongoDbType];

        switch (mongoDbType) {
            default:
                return new MongoDbStrategy();
        }
    }
}