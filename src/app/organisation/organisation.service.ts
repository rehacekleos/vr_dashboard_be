import { BaseService } from "../../shared/services/Base.service";
import { OrganisationDataAccess } from "./organisation.dataAccess";
import { User } from "../user/user.model";
import { NewOrganisation, Organisation } from "./organisation.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { NewEmployee } from "../employee/employee.model";
import { RoleNames } from "../../models/role.model";

/**
 * Service for entity Organisation
 */
export class OrganisationService extends BaseService {

    /**
     *
     * @param orgDa
     * @param employeeDa
     */
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

        const newOrg =  await this.orgDa.createOrganisation(body.name);

        if (!user.superAdmin){
            const emp: NewEmployee = {
                organisationId: newOrg.id,
                userId: user.id,
                role: {
                    name: RoleNames.ADMIN
                }
            }
            await this.employeeDa.createEmployee(emp);
        }

        return newOrg;
    }

    public async deleteOrganisation(id: string, user: User){
        const org = await this.getOrganisationByIdForUser(id, user);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, 'Organisation not found.')
        }
        await this.orgDa.deleteOrganisation(id);
    }
}