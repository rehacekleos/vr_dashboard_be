import { mongoDbIndexes } from '../mongoDb.indexes';
import { DatabaseIndexType, mongoDbIndex, StandardIndex, TTLIndex } from './mongoDb.strategy.factory';
import { Db, MongoClient } from 'mongodb';
import { ConfigFactory } from '../../../../configs/config.factory';

/**
 * Support for database setup
 */
export class MongoDbStrategy {
    private readonly indexes: mongoDbIndex[] = mongoDbIndexes;
    private readonly config = ConfigFactory.getConfig();

    /**
     * Creates database collections if they do not exist
     * @param client MongoDB client
     */
    public async createCollections(client: MongoClient){
        console.info("Mongo creating collections!");
        const db = client.db(this.config.mongoDbDatabase);
        const promisesArray = []
        for (const collection of this.config.mongoDbCollections) {
                promisesArray.push(new Promise(async (resolve, reject) => {
                        try {
                            await db.createCollection(collection);
                            console.info(`Mongo collection ${collection} is created!`);
                        } catch (e) {
                            reject(e.message);
                        }
                    }
                ))
                }
        try{
            await Promise.all(promisesArray).catch(() => {});
            console.info("Mongo collection created or updated!");
        } catch (e) {
        }
    }

    /**
     * Creates database indexes if they do not exist
     * @param client MongoDB client
     */
    public async createIndexing(client: MongoClient) {
        console.info("Mongo creating indexing!");
        const db = client.db(this.config.mongoDbDatabase);
        const promisesArray = []
        for (const index of this.indexes) {
            if (index.type !== DatabaseIndexType.COMPOUND && index.drop) {
                await this.dropIndex(index, db);
            }
            switch (index.type) {
                case DatabaseIndexType.STANDARD:
                    promisesArray.push(this.createClassicIndex(index, db));
                    break;
                case DatabaseIndexType.COMPOUND:
                    promisesArray.push(this.createClassicIndex(index, db));
                    break;
                case DatabaseIndexType.TTL:
                    promisesArray.push(this.createTTLIndex(index, db));
                    break;
            }
        }
        await Promise.all(promisesArray);
        console.info("Mongo indexes created!");
    }

    /**
     * Removes indexes from the database
     * @param index index to remove
     * @param db instance of db
     */
    public async dropIndex(index: StandardIndex | TTLIndex, db: Db){
        const collectionIndexes = await db.collection(index.collection).indexes();
        if (collectionIndexes.findIndex(i => i.name === index.name + '_1') !== -1){
            try {
                await db.collection(index.collection).dropIndex(index.name + '_1');
            } catch (e) {
                console.error('Cannot drop index with name:', index.name);
            }
        }
    }

    /**
     * Creating standard index
     * @param index index to create
     * @param db instance of db
     */
    public async createClassicIndex(index: mongoDbIndex, db: Db) {
        const obj = {}
        if (index.type === DatabaseIndexType.STANDARD && index.name) {
            obj[index.name] = 1;
        }
        if (index.type === DatabaseIndexType.COMPOUND && index.names){
            for (let name of index.names){
                obj[name] = 1;
            }
        }
        return await db.collection(index.collection).createIndex(obj);
    }

    /**
     * Creating TTL index
     * @param index index to create
     * @param db instance of db
     */
    public async createTTLIndex(index: TTLIndex, db: Db) {
        const obj = {}
        obj[index.name] = 1;
        return await db.collection(index.collection).createIndex(obj, {expireAfterSeconds: index.value});
    }

}
