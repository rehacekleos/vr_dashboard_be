import { BaseService } from "../../shared/services/Base.service";
import { ApplicationDataAccess } from "./application.dataAccess";
import { AddModule, Application, NewApplication } from "./application.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";
import { ApplicationAssignmentDataAccess } from "../application_assignment/application_assignment_data_access";
import AdmZip from "adm-zip";
import path from "path";
import * as zlib from "zlib";

export class ApplicationService extends BaseService{

    constructor(private applicationDa: ApplicationDataAccess,
                private applicationAssigmentDa: ApplicationAssignmentDataAccess,
                private orgDa: OrganisationDataAccess) {
        super();
    }

    public async getApplicationsForOrganisation(orgId: string): Promise<Application[]> {
        const assignments = await this.applicationAssigmentDa.getAssignmentsByOrgId(orgId);
        if (assignments.length < 1){
            return [];
        }
        const applicationIds = assignments.map(a => a.applicationId);
        return await this.applicationDa.getApplicationsByIds(applicationIds);
    }

    public async getApplication(id: string): Promise<Application> {
        return await this.applicationDa.getApplication(id);
    }

    public async createApplication(application: NewApplication, orgId: string): Promise<Application> {
        return await this.applicationDa.createApplication(application);
    }

    public async assignApplication(applicationId: string, orgId: string) {
        const assignments = await this.applicationAssigmentDa.getAssignmentsByOrgId(orgId);
        if (assignments.find(a => a.applicationId === applicationId)){
            throw new HttpException(400, "Application is already assigned to organisation.");
        }
        await this.applicationAssigmentDa.createAssignment(applicationId, orgId);
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

    async addModule(applicationId: string, module: AddModule) {
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