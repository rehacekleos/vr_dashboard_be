import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "../application/application.dataAccess";
import { Application } from "../application/application.model";

export class AdminService extends BaseService{

    constructor(private applicationDa: ApplicationDataAccess) {
        super();
    }


    async getAllApplications(): Promise<Application[]> {
        return await this.applicationDa.getAllApplications();
    }
}