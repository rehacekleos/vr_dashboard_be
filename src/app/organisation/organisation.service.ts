import { BaseService } from "../../shared/services/Base.service";
import { OrganisationDataAccess } from "./organisation.dataAccess";
import { User } from "../user/user.model";
import { NewOrganisation, Organisation } from "./organisation.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { WrongBody } from "../../shared/exceptions/HttpException";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { AdminRole } from "../../models/role.model";

export class OrganisationService extends BaseService {

    private organisationDataAccess = OrganisationDataAccess.getInstance();
    private employeeDataAccess = EmployeeDataAccess.getInstance();


    async getOrganisationsForUser(user: User): Promise<Organisation[]> {
        const employees = await this.employeeDataAccess.getEmployeesForUser(user.id);
        if (employees.length < 1){
            return [];
        }
        const orgIds = employees.map(e => e.organisationId);
        return await this.organisationDataAccess.getOrganisationsByIds(orgIds);
    }

    async createOrganisation(body: NewOrganisation, user: User) {
        if (isEmptyAndNull(body.name)){
            new WrongBody("New Organisation")
        }

        const newOrganisation = await this.organisationDataAccess.createOrganisation(body.name, user.id);
        await this.employeeDataAccess.createEmployee(newOrganisation.id, user.id, AdminRole);
    }
}