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
     * @constructor
     * @param orgDa
     * @param employeeDa
     */
    constructor(private orgDa: OrganisationDataAccess,
                private employeeDa: EmployeeDataAccess) {
        super();
    }

    /**
     * Get all Organisations for User
     * @param user
     * @returns {Promise<Organisation[]>}
     */
    public async getOrganisationsForUser(user: User): Promise<Organisation[]> {
        const employees = await this.employeeDa.getEmployeesForUser(user.id);
        if (employees.length < 1) {
            return [];
        }
        const orgIds = employees.map(e => e.organisationId);
        return await this.orgDa.getOrganisationsByIds(orgIds);
    }

    /**
     * Get Organisation by ID for User
     * @param id
     * @param user
     * @returns {Promise<Organisation>}
     */
    public async getOrganisationByIdForUser(id: string, user: User): Promise<Organisation> {
        if (user.superAdmin === true) {
            return await this.orgDa.getOrganisationById(id);
        }

        const employee = await this.employeeDa.getEmployeeForOrgAndUser(id, user.id);
        if (isEmptyAndNull(employee)) {
            return null;
        }

        return await this.orgDa.getOrganisationById(employee.organisationId);
    }

    /**
     * Get Organisation by code
     * @param code
     * @returns {Promise<Organisation>}
     */
    public async getOrganisationByCode(code: string): Promise<Organisation> {
        return await this.orgDa.getOrganisationByCode(code);
    }

    /**
     * Create new Organisation
     * @param body
     * @param user
     * @returns {Promise<void>}
     */
    public async createOrganisation(body: NewOrganisation, user: User): Promise<Organisation> {
        if (isEmptyAndNull(body.name)) {
            new WrongBody("New Organisation")
        }

        const newOrg = await this.orgDa.createOrganisation(body.name);

        if (!user.superAdmin) {
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

    /**
     * Delete Organisation
     * @param id
     * @param user
     * @returns {Promise<void>}
     */
    public async deleteOrganisation(id: string, user: User): Promise<void> {
        if (!user.superAdmin) {
            throw new HttpException(400, "You are not superAdmin.");
        }

        const org = await this.getOrganisationByIdForUser(id, user);
        if (isEmptyAndNull(org)) {
            throw new HttpException(400, 'Organisation not found.')
        }
        await this.orgDa.deleteOrganisation(id);
    }
}