import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Role } from "../../models/role.model";
import { Employee } from "./employee.model";
import { v4 as uuid } from 'uuid'
import { User } from "../user/user.model";

export class EmployeeDataAccess extends BaseDataAccess {

    private static instance: EmployeeDataAccess;

    constructor() {
        super(CollectionName.EMPLOYEES);
    }

    public static getInstance() {
        if (!EmployeeDataAccess.instance) {
            EmployeeDataAccess.instance = new EmployeeDataAccess();
        }
        return EmployeeDataAccess.instance;
    }

    async getEmployeeForOrgAndUser(orgId: string, userId: string): Promise<Employee> {
        return await this.db.collection(this.collection).findOne<Employee>({organisationId: orgId, userId: userId});
    }

    async getEmployeesForUser(userId: string): Promise<Employee[]> {
        return await this.db.collection(this.collection).find<Employee>({userId: userId}).toArray();
    }

    async getEmployeesForOrganisation(organisationId: string): Promise<Employee[]> {
        return await this.db.collection(this.collection).find<Employee>({organisationId: organisationId}).toArray();
    }

    async createEmployee(orgId: string, userId: string, role: Role): Promise<Employee> {
        const newEmployee: Employee = {
            id: uuid(),
            organisationId: orgId,
            userId: userId,
            role: role,
            participantIds: []
        }

        const res = await this.db.collection(this.collection).insertOne(newEmployee)
        if (res.acknowledged === false) {
            throw new Error("Cannot save employee into DB.")
        }

        return newEmployee;
    }

    async addParticipant(id: string, participantId: string){
        const res = await this.db.collection(this.collection).updateOne({id: id}, {$push: { participantIds: participantId}});
        if (res.acknowledged === false){
            throw new Error("Cannot save user into DB.")
        }
    }

    async removeParticipant(id: string, participantId: string) {
        const res = await this.db.collection(this.collection).updateOne({id: id}, {$pull: { participantIds: participantId}});
        if (res.acknowledged === false){
            throw new Error("Cannot save user into DB.")
        }
    }

    async deleteEmployee(orgId: string, userId: string) {
        const res = await this.db.collection(this.collection).deleteOne({organisationId: orgId, userId: userId});
        if (res.acknowledged === false) {
            throw new Error("Cannot delete employee from DB.")
        }
    }

}