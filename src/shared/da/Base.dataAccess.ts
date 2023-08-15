import { Db } from 'mongodb';
import { CollectionName } from '../repositories/mongoDb/collectionName.enum';
import { MongoDbConnection } from "../repositories/mongoDb/mongoDb.connection";
import { ConfigFactory } from "../../configs/factories/config.factory";

export class BaseDataAccess{
    public db: Db;
    protected collection: string;

    constructor(collection: CollectionName) {
        this.connect().then()
        this.collection = collection;
    }

    private async connect() {
        const mongoDbConnection = MongoDbConnection.getInstance();
        const mongoClient = await mongoDbConnection.mongoClient;
        if (mongoClient) {
            this.db = mongoClient.db(ConfigFactory.getConfig().mongoDbDatabase);
        } else {
            console.error("Mongo DB is not connected!")
        }
    }

}