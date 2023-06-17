import { BaseService } from '../../shared/services/Base.service';
import { DefaultDataAccess } from './default.dataAccess';

export class DefaultService extends BaseService{

    private defaultDa = DefaultDataAccess.getInstance();

    constructor() {
        super();
    }


    public async defaultGet(){
        return this.defaultDa.defaultGet();
    }


}