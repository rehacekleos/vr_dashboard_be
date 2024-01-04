import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "../application/application.dataAccess";
import { Application } from "../application/application.model";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";

/**
 * Service for administrators
 */
export class AdminService extends BaseService{

    /**
     *
     * @param applicationDa
     * @param organisationDa
     */
    constructor(private applicationDa: ApplicationDataAccess,
                private organisationDa: OrganisationDataAccess) {
        super();
    }


    async getAllApplications(): Promise<Application[]> {
        return await this.applicationDa.getAllApplications();
    }

    async getAllOrganisations() {
        return await this.organisationDa.getAllOrganisations();
    }
}