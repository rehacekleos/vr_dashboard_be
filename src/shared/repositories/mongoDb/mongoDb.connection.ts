import { MongoClient } from 'mongodb';
import cluster from 'cluster';
import { ConfigFactory } from '../../../configs/config.factory';
import { MongoDbStrategyFactory } from './strategies/mongoDb.strategy.factory';

/**
 * Singleton that takes care of connecting to the database and setting it up.
 */
export class MongoDbConnection {
    private static instance: MongoDbConnection
    public readonly mongoClient: Promise<MongoClient>
    public static isConnected = false;

    /***
     *
     * @param isPrimary true if current thread is master from cluster
     */
    constructor(isPrimary?: boolean) {
        const dbURL = ConfigFactory.getConfig().dbUrl;

        try {
            console.log(dbURL)
            const hostName = new URL(dbURL)?.hostname;
            console.info('Mongo hostname', hostName)
        } catch (e) {
            console.error('cannot parse Mongo DB connection url');
            return;
        }
        console.info('Creating Mongo client', dbURL);
        this.mongoClient = MongoClient.connect(encodeURI(dbURL)).then(async (res) => {
                console.info('Mongo client connected!');

                if (isPrimary || isPrimary === undefined) {
                    try {
                        const databaseStrategy = MongoDbStrategyFactory.getDbStrategy();
                        await databaseStrategy.createCollections(res);
                        await databaseStrategy.createIndexing(res);
                    } catch (e) {
                        console.error(e)
                    }
                }

                MongoDbConnection.isConnected = true;
                return res;
            }
        );
    }

    public static getInstance() {
        if (!MongoDbConnection.instance) {
            MongoDbConnection.instance = new MongoDbConnection(cluster.isPrimary)
        }
        return MongoDbConnection.instance;
    }
}