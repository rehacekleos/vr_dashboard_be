import { BaseService } from "../../shared/services/Base.service";
import { OrganisationDataAccess } from "./organisation.dataAccess";
import { User } from "../user/user.model";
import { NewOrganisation, Organisation } from "./organisation.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { AdminRole, RoleNames } from "../../models/role.model";
import { NewEmployee } from "../employee/employee.model";

export class OrganisationService extends BaseService {

    constructor(private orgDa: OrganisationDataAccess,
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

    public async getOrganisationById(id: string): Promise<Organisation> {
        return await this.orgDa.getOrganisationById(id);
    }

    public async getOrganisationByCode(code: string): Promise<Organisation> {
        return await this.orgDa.getOrganisationByCode(code);
    }

    public async createOrganisation(body: NewOrganisation, user: User) {
        if (isEmptyAndNull(body.name)){
            new WrongBody("New Organisation")
        }

        const newOrganisation = await this.orgDa.createOrganisation(body.name, user.id);
        const newEmpl: NewEmployee = {
            organisationId: newOrganisation.id,
            userId: user.id,
            role: {
                name: RoleNames.ADMIN
            }
        }
        await this.employeeDa.createEmployee(newEmpl);
        return newOrganisation;
    }

    public async deleteOrganisation(id: string){
        const org = await this.orgDa.getOrganisationById(id);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, 'Organisation not found.')
        }
        await this.orgDa.deleteOrganisation(id);
    }
}