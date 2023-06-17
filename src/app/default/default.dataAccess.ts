import { BaseDataAccess } from '../../shared/da/Base.dataAccess';
import { CollectionName } from '../../shared/repositories/mongoDb/collectionName.enum';

export class DefaultDataAccess extends BaseDataAccess{

    private static instance: DefaultDataAccess;

    constructor() {
        super(CollectionName.DEFAULT);
    }

    public static getInstance(){
        if (!DefaultDataAccess.instance){
            DefaultDataAccess.instance = new DefaultDataAccess();
        }
        return DefaultDataAccess.instance;
    }


    public async defaultGet(){
        return await this.db.collection(this.collection).findOne();
    }


}