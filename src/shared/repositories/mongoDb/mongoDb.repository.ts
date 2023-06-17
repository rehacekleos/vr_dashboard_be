import { Db } from 'mongodb';
import { MongoDbConnection } from './mongoDb.connection';
import { ConfigFactory } from '../../../configs/factories/config.factory';

export class MongoDbRepository {
    private static instance: MongoDbRepository;
    public db: Db;

    constructor() {
        this.connect().then();
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

    public static getInstance(){
        if (!MongoDbRepository.instance){
            MongoDbRepository.instance = new MongoDbRepository();
        }
        return MongoDbRepository.instance;
    }
}