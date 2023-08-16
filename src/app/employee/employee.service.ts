import { BaseService } from "../../shared/services/Base.service";
import { Role } from "../../models/role.model";
import { Employee, NewEmployee } from "./employee.model";
import { UserDataAccess } from "../user/user.dataAccess";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";
import { EmployeeDataAccess } from "./employee.dataAccess";

export class EmployeeService extends BaseService {

    constructor(private employeeDa: EmployeeDataAccess,
                private userDa: UserDataAccess,
                private orgDa: OrganisationDataAccess) {
        super();
    }

    public async getEmployeesForUser(userId: string): Promise<Employee[]> {
        const user = await this.userDa.getUserById(userId);
        if (isEmptyAndNull(user)) {
            throw new HttpException(400, 'User not found');
        }
        return await this.employeeDa.getEmployeesForUser(userId);
    }

    public async getEmployeeForOrgAndUser(orgId: string, userId: string): Promise<Employee> {
        const user = await this.userDa.getUserById(userId);
        if (isEmptyAndNull(user)) {
            throw new HttpException(400, 'User not found');
        }
        const org = await this.orgDa.getOrganisationById(orgId);
        if (isEmptyAndNull(org)) {
            throw new HttpException(400, 'Organisation not found');
        }
        return await this.employeeDa.getEmployeeForOrgAndUser(orgId, userId);
    }

    public async createEmployee(newEmpl: NewEmployee): Promise<Employee> {
        const user = await this.userDa.getUserById(newEmpl.userId);
        if (isEmptyAndNull(user)) {
            throw new HttpException(400, 'User not found');
        }

        const org = await this.orgDa.getOrganisationById(newEmpl.organisationId);
        if (isEmptyAndNull(org)) {
            throw new HttpException(400, 'Organisation not found');
        }

        const existedEmployee = await this.employeeDa.getEmployeeForOrgAndUser(newEmpl.organisationId, newEmpl.userId);
        if (!isEmptyAndNull(existedEmployee)){
            throw new HttpException(400, 'Employee already exists.');
        }

        return await this.employeeDa.createEmployee(newEmpl);
    }


}