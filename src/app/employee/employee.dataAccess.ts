import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Employee, NewEmployee } from "./employee.model";
import { v4 as uuid } from 'uuid'

/**
 * Singleton DataAccess for entity Employee
 */
export class EmployeeDataAccess extends BaseDataAccess {

    /** Instance */
    private static instance: EmployeeDataAccess;

    /**
     * @constructor
     */
    constructor() {
        super(CollectionName.EMPLOYEES);
    }

    public static getInstance(){
        if (!EmployeeDataAccess.instance){
            EmployeeDataAccess.instance = new EmployeeDataAccess();
        }
        return EmployeeDataAccess.instance;
    }

    public async getEmployeeForOrgAndUser(orgId: string, userId: string): Promise<Employee> {
        return await this.db.collection(this.collection).findOne<Employee>({organisationId: orgId, userId: userId});
    }

    public async getEmployeesForUser(userId: string): Promise<Employee[]> {
        return await this.db.collection(this.collection).find<Employee>({userId: userId}).toArray();
    }


    public async getEmployeesForOrganisation(organisationId: string): Promise<Employee[]> {
        return await this.db.collection(this.collection).find<Employee>({organisationId: organisationId}).toArray();
    }

    public async createEmployee(newEmpl: NewEmployee): Promise<Employee> {
        const newEmployee: Employee = {
            id: uuid(),
            organisationId: newEmpl.organisationId,
            userId: newEmpl.userId,
            role: newEmpl.role,
            participantIds: []
        }

        const res = await this.db.collection(this.collection).insertOne(newEmployee)
        if (res.acknowledged === false) {
            throw new Error("Cannot save employee into DB.")
        }

        return newEmployee;
    }

    public async addParticipant(id: string, participantId: string){
        const res = await this.db.collection(this.collection).updateOne({id: id}, {$push: { participantIds: participantId}});
        if (res.acknowledged === false){
            throw new Error("Cannot add participant in DB.")
        }
    }

    async assignParticipants(employeeId: string, participants: string[]) {
        const res = await this.db.collection(this.collection).updateOne({id: employeeId}, {$set: { participantIds: participants}});
        if (res.acknowledged === false){
            throw new Error("Cannot assign participants in DB.")
        }
    }

    public async removeParticipant(id: string, participantId: string) {
        const res = await this.db.collection(this.collection).updateOne({id: id}, {$pull: { participantIds: participantId}});
        if (res.acknowledged === false){
            throw new Error("Cannot remove participant in DB.")
        }
    }

    async deleteEmployeeById(empId: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: empId});
        if (res.acknowledged === false) {
            throw new Error("Cannot delete employee from DB.")
        }
    }

    async changeEmployeeRole(employeeId: string, roleName: string) {
        const res = await this.db.collection(this.collection).updateOne({id: employeeId}, {$set: {"role.name": roleName}});
        if (res.acknowledged === false){
            throw new Error("Cannot update employee in DB.")
        }
    }

}