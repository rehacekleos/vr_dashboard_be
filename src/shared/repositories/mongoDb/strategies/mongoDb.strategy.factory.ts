import { MongoDbStrategy } from "./mongoDb.strategy";
import { ConfigFactory } from '../../../../configs/config.factory';

/**
 * Type of MongoDB
 */
export enum MongoDbType{
    COSMOSDB = 'COSMOSDB',
    DOCUMENTDB = 'DOCUMENTDB',
    MONGODB = 'MONGODB'
}

/**
 * Type of MongoDB index
 */
export type mongoDbIndex = StandardIndex | CompoundIndex | TTLIndex;

/**
 * Model of MongoDB Standard index
 */
export interface StandardIndex {
    /** Name/attribute of index */
    name: string;
    /** Collection */
    collection: string;
    /** Index type */
    type: DatabaseIndexType.STANDARD;
    /** If we want to drop before create */
    drop?: boolean;
}

/**
 * Model of MongoDB Compound index
 */
export interface CompoundIndex {
    /** Names/attributes of compound index */
    names?: string[]
    /** Collection */
    collection: string;
    /** Index type */
    type: DatabaseIndexType.COMPOUND;
}

/**
 * Model of MongoDB TTL index
 */
export interface TTLIndex {
    /** Name/attribute of index */
    name: string;
    /** Collection */
    collection: string;
    /** Index type */
    type: DatabaseIndexType.TTL;
    /** Value of TTL */
    value: any;
    /** If we want to drop before create */
    drop?: boolean;
}

/**
 * Types of database index
 */
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