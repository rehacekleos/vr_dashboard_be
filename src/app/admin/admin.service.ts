import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "../application/application.dataAccess";
import { Application } from "../application/application.model";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";
import { Organisation } from "../organisation/organisation.model";

/**
 * Service for administrators
 */
export class AdminService extends BaseService{

    /**
     * @constructor
     * @param applicationDa
     * @param organisationDa
     */
    constructor(private applicationDa: ApplicationDataAccess,
                private organisationDa: OrganisationDataAccess) {
        super();
    }


    /**
     * Get all Applications
     * @returns {Promise<Application[]>}
     */
    async getAllApplications(): Promise<Application[]> {
        return await this.applicationDa.getAllApplications();
    }

    /**
     * Get all Organisations
     * @returns {Promise<Organisation[]>}
     */
    async getAllOrganisations(): Promise<Organisation[]> {
        return await this.organisationDa.getAllOrganisations();
    }
}