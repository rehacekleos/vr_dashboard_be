import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "./application.dataAccess";
import { Application, NewApplication } from "./application.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";

export class ApplicationService extends BaseService{

    constructor(private applicationDa: ApplicationDataAccess,
                private orgDa: OrganisationDataAccess) {
        super();
    }

    public async getApplication(id: string): Promise<Application> {
        return await this.applicationDa.getApplication(id);
    }

    public async createApplication(application: NewApplication): Promise<Application> {
        const org = await this.orgDa.getOrganisationById(application.organisationId);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, "Organisation not found.");
        }

        return await this.applicationDa.createApplication(application);
    }

    public async updateSetting(id: string, setting: any): Promise<Application> {
        const app = await this.applicationDa.getApplication(id);
        if (isEmptyAndNull(app)){
            throw new HttpException(400, "Application not found");
        }

        return await this.applicationDa.updateSetting(id, setting);
    }

    public async deleteApplication(id: string) {
        const app = await this.applicationDa.getApplication(id);
        if (isEmptyAndNull(app)){
            throw new HttpException(400, "Application not found");
        }

        return await this.applicationDa.deleteApplication(id);
    }
}