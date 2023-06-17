import { Db } from 'mongodb';
import { MongoDbRepository } from '../repositories/mongoDb/mongoDb.repository';
import { CollectionName } from '../repositories/mongoDb/collectionName.enum';

export class BaseDataAccess{
    public db: Db;
    protected collection: string;

    constructor(collection: CollectionName) {
        this.db = MongoDbRepository.getInstance().db;
        this.collection = collection;
    }

}