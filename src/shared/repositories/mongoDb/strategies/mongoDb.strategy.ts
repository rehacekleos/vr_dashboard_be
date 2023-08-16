import { mongoDbIndexes } from '../indexes/mongoDb.indexes';
import { DatabaseIndexType, mongoDbIndex } from './mongoDb.strategy.factory';
import { Db, MongoClient } from 'mongodb';
import { ConfigFactory } from '../../../../configs/factories/config.factory';

export class MongoDbStrategy {
    private readonly indexes: mongoDbIndex[] = mongoDbIndexes;
    private readonly config = ConfigFactory.getConfig();

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
            await Promise.all(promisesArray);
        } catch (e) {
        }
    }

    public async createIndexing(client: MongoClient) {
        console.info("Mongo creating indexing!");
        const db = client.db(this.config.mongoDbDatabase);
        const promisesArray = []
        for (const index of this.indexes) {
            if (index.drop) {
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

    public async dropIndex(index: mongoDbIndex, db: Db){
        const collectionIndexes = await db.collection(index.collection).indexes();
        if (collectionIndexes.findIndex(i => i.name === index.name + '_1') !== -1){
            try {
                await db.collection(index.collection).dropIndex(index.name + '_1');
            } catch (e) {
                console.error('Cannot drop index with name:', index.name);
            }
        }
    }

    public async createClassicIndex(index: mongoDbIndex, db: Db) {
        const obj = {}
        if (index.name) {
            obj[index.name] = 1;
        }
        if (index.names){
            for (let name of index.names){
                obj[name] = 1;
            }
        }
        return await db.collection(index.collection).createIndex(obj);
    }

    public async createTTLIndex(index: mongoDbIndex, db: Db) {
        const obj = {}
        obj[index.name] = 1;
        return await db.collection(index.collection).createIndex(obj, {expireAfterSeconds: index.value});
    }

}
