import { BaseService } from "../../shared/services/Base.service";
import { RoleNames } from "../../models/role.model";
import { AssignParticipantsModel, ChangeRoleModel, Employee, NewEmployee } from "./employee.model";
import { UserDataAccess } from "../user/user.dataAccess";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";
import { EmployeeDataAccess } from "./employee.dataAccess";
import { User } from "../user/user.model";

/**
 * Service for entity Employee <br>
 * It is connection between {@link User} and {@link Organisation}.
 */
export class EmployeeService extends BaseService {

    /**
     * @constructor
     * @param employeeDa
     * @param userDa
     * @param orgDa
     */
    constructor(private employeeDa: EmployeeDataAccess,
                private userDa: UserDataAccess,
                private orgDa: OrganisationDataAccess) {
        super();
    }

    /**
     * Get all Employees for User
     * @param userId
     * @returns {Promise<Employee[]>}
     */
    public async getEmployeesForUser(userId: string): Promise<Employee[]> {
        const user = await this.userDa.getUserById(userId);
        if (isEmptyAndNull(user)) {
            throw new HttpException(400, 'User not found');
        }
        const employees =  await this.employeeDa.getEmployeesForUser(userId);
        return employees.map(e => {
            return {
                ...e,
                user: user
            }
        })
    }

    /**
     * Get all Employees for Organisation
     * @param orgId
     * @returns {Promise<Employee[]>}
     */
    public async getEmployeesForOrg(orgId: string): Promise<Employee[]> {
        const users = await this.userDa.getAllUsers();
        const userMap = new Map(users.map(u => [u.id, u]));
        const employees =  await this.employeeDa.getEmployeesForOrganisation(orgId);
        return employees.map(e => {
            const user = userMap.get(e.userId);
            return {
                ...e,
                user: user
            }
        })
    }

    /**
     * Get Employee for User and Organisation
     * @param orgId
     * @param userId
     * @returns {Promise<Employee>}
     */
    public async getEmployeeForOrgAndUser(orgId: string, userId: string): Promise<Employee> {
        const user = await this.userDa.getUserById(userId);
        if (isEmptyAndNull(user)) {
            throw new HttpException(400, 'User not found');
        }
        const org = await this.orgDa.getOrganisationById(orgId);
        if (isEmptyAndNull(org)) {
            throw new HttpException(400, 'Organisation not found');
        }
        return  await this.employeeDa.getEmployeeForOrgAndUser(orgId, userId);
    }

    /**
     * Create new Employee
     * @param newEmpl
     * @returns {Promise<Employee>}
     */
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

    /**
     * Add Participant to Employee<br>
     * It means add Participant to User in specific Organisation
     * @param id
     * @param participantId
     * @returns {Promise<void>}
     */
    public async addParticipant(id: string, participantId: string): Promise<void>{
        return await this.employeeDa.addParticipant(id, participantId);
    }

    /**
     * Add Participants to Employee<br>
     * It means add Participants to User in specific Organisation
     * @param assign
     * @param orgId
     * @param user
     * @param emp
     * @returns {Promise<void>}
     */
    async assignParticipants(assign: AssignParticipantsModel, orgId: string, user: User, emp: Employee): Promise<void> {
        if (!user.superAdmin){
            if (emp.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }

        const employeeForOrg = await this.employeeDa.getEmployeesForOrganisation(orgId);
        const employee = employeeForOrg.find(e => e.id === assign.employeeId);
        if (isEmptyAndNull(employee)){
            throw new HttpException(400, 'Employee not found');
        }

        await this.employeeDa.assignParticipants(assign.employeeId, assign.participants);
    }

    /**
     * Change Employee role <br>
     * It means change User role in specific Organisation
     * @param changeRole
     * @param orgId
     * @param user
     * @param emp
     * @returns {Promise<void>}
     */
    async changeEmployeeRole(changeRole: ChangeRoleModel, orgId: string, user: User, emp: Employee): Promise<void> {
        if (!user.superAdmin){
            if (emp.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }

        const employeeForOrg = await this.employeeDa.getEmployeesForOrganisation(orgId);
        const employee = employeeForOrg.find(e => e.id === changeRole.employeeId);
        if (isEmptyAndNull(employee)){
            throw new HttpException(400, 'Employee not found');
        }

        await this.employeeDa.changeEmployeeRole(changeRole.employeeId, changeRole.roleName);
    }

    /**
     * Delete Employee
     * @param empId
     * @param orgId
     * @param user
     * @param emp
     * @returns {Promise<void>}
     */
    async deleteEmployee(empId: string, orgId: string, user: User, emp: Employee): Promise<void> {
        if (!user.superAdmin){
            if (emp.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }

        const employeeForOrg = await this.employeeDa.getEmployeesForOrganisation(orgId);
        const employee = employeeForOrg.find(e => e.id === empId);
        if (isEmptyAndNull(employee)){
            throw new HttpException(400, 'Employee not found');
        }

        await this.employeeDa.deleteEmployeeById(empId);
    }


}