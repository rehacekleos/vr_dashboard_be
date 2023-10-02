import { BaseService } from "../../shared/services/Base.service";
import { OrganisationDataAccess } from "./organisation.dataAccess";
import { User } from "../user/user.model";
import { NewOrganisation, Organisation } from "./organisation.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { ParticipantDataAccess } from "../participant/participant.dataAccess";
import { ApplicationDataAccess } from "../application/application.dataAccess";

export class OrganisationService extends BaseService {

    constructor(private orgDa: OrganisationDataAccess,
                private participantDa: ParticipantDataAccess,
                private applicationDa: ApplicationDataAccess,
                private employeeDa: EmployeeDataAccess) {
        super();
    }

    public async getOrganisationsForUser(user: User): Promise<Organisation[]> {
        const employees = await this.employeeDa.getEmployeesForUser(user.id);
        if (employees.length < 1){
            return [];
        }
        const orgIds = employees.map(e => e.organisationId);
        return await this.orgDa.getOrganisationsByIds(orgIds);
    }

    public async getOrganisationByIdForUser(id: string, user: User): Promise<Organisation> {
        if (user.superAdmin === true){
            return await this.orgDa.getOrganisationById(id);
        }

        const employee = await this.employeeDa.getEmployeeForOrgAndUser(id, user.id);
        if (isEmptyAndNull(employee)){
            return null;
        }

        return await this.orgDa.getOrganisationById(employee.organisationId);
    }

    public async getOrganisationByCode(code: string): Promise<Organisation> {
        return await this.orgDa.getOrganisationByCode(code);
    }

    public async createOrganisation(body: NewOrganisation, user: User) {
        if (isEmptyAndNull(body.name)){
            new WrongBody("New Organisation")
        }

        return await this.orgDa.createOrganisation(body.name);
    }

    public async deleteOrganisation(id: string, user: User){
        const org = await this.getOrganisationByIdForUser(id, user);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, 'Organisation not found.')
        }
        await this.orgDa.deleteOrganisation(id);
    }
}