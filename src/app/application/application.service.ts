import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "./application.dataAccess";
import { AddModule, Application, NewApplication } from "./application.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { ApplicationAssignmentDataAccess } from "../application_assignment/application_assignment_data_access";
import AdmZip from "adm-zip";
import path from "path";
import { User } from "../user/user.model";

/**
 * Service for entity Application
 */
export class ApplicationService extends BaseService{

    /**
     * @constructor
     * @param applicationDa
     * @param applicationAssigmentDa
     */
    constructor(private applicationDa: ApplicationDataAccess,
                private applicationAssigmentDa: ApplicationAssignmentDataAccess) {
        super();
    }

    /**
     * Get Applications for Organisation
     * @param orgId
     * @returns {Promise<Application[]>}
     */
    public async getApplicationsForOrganisation(orgId: string): Promise<Application[]> {
        const assignments = await this.applicationAssigmentDa.getAssignmentsByOrgId(orgId);
        if (assignments.length < 1){
            return [];
        }
        const applicationIds = assignments.map(a => a.applicationId);
        return await this.applicationDa.getApplicationsByIds(applicationIds);
    }

    /**
     * Get Application by ID
     * @param id
     * @returns {Promise<Application>}
     */
    public async getApplication(id: string): Promise<Application> {
        return await this.applicationDa.getApplication(id);
    }

    /**
     * Create new Application
     * @param application
     * @param orgId
     * @param user
     * @returns {Promise<Application>}
     */
    public async createApplication(application: NewApplication, orgId: string, user: User): Promise<Application> {
        if (!user.superAdmin && !user.developer){
            throw new HttpException(400, "You do not have permission");
        }

        const allApplications = await this.applicationDa.getAllApplications();
        if (allApplications.some(a => a.identifier === application.identifier)){
            throw new HttpException(400, "Application with this identifier already exists.");
        }

        return await this.applicationDa.createApplication(application);
    }

    /**
     * Assign Application to Organisation
     * @param applicationId
     * @param orgId
     * @param user
     * @returns {Promise<void>}
     */
    public async assignApplication(applicationId: string, orgId: string, user: User): Promise<void> {
        if (!user.superAdmin && !user.developer){
            throw new HttpException(400, "You do not have permission");
        }

        const assignments = await this.applicationAssigmentDa.getAssignmentsByOrgId(orgId);
        if (assignments.find(a => a.applicationId === applicationId)){
            throw new HttpException(400, "Application is already assigned to organisation.");
        }
        await this.applicationAssigmentDa.createAssignment(applicationId, orgId);
    }

    /**
     * Update Application settings
     * @param id
     * @param setting
     * @param user
     * @returns {Promise<Application>}
     */
    public async updateSetting(id: string, setting: any, user: User): Promise<Application> {
        if (!user.superAdmin && !user.developer){
            throw new HttpException(400, "You do not have permission");
        }

        const app = await this.applicationDa.getApplication(id);
        if (isEmptyAndNull(app)){
            throw new HttpException(400, "Application not found");
        }

        return await this.applicationDa.updateSetting(id, setting);
    }

    /**
     * Delete Application
     * @param id
     * @param user
     * @returns {Promise<void>}
     */
    public async deleteApplication(id: string, user: User): Promise<void> {
        if (!user.superAdmin && !user.developer){
            throw new HttpException(400, "You do not have permission");
        }

        const app = await this.applicationDa.getApplication(id);
        if (isEmptyAndNull(app)){
            throw new HttpException(400, "Application not found");
        }

        return await this.applicationDa.deleteApplication(id);
    }

    /**
     * Add Application Module
     * @param applicationId
     * @param module
     * @param user
     * @returns {Promise<void>}
     */
    async addModule(applicationId: string, module: AddModule, user: User): Promise<void> {
        if (!user.superAdmin && !user.developer){
            throw new HttpException(400, "You do not have permission");
        }

        if (isEmptyAndNull(module.module) || isEmptyAndNull(module.module_version)){
            throw new WrongBody("Module");
        }
        const app = await this.applicationDa.getApplication(applicationId);
        if (isEmptyAndNull(app)){
            throw new HttpException(400, "Application not found");
        }
        const buffer = Buffer.from(module.module, "base64");
        try {
            const zip = new AdmZip(buffer);
            zip.extractAllTo(path.resolve(__dirname, `../../../public/modules/${applicationId}/${module.module_version}`), true);
        } catch (e) {
            throw new HttpException(400, "Cannot uncompressed zip file.")
        }

        await this.applicationDa.updateApplicationModule(applicationId, module.module_version);

    }
}