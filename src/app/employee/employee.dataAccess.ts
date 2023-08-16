import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Role } from "../../models/role.model";
import { Employee, NewEmployee } from "./employee.model";
import { v4 as uuid } from 'uuid'
import { User } from "../user/user.model";

export class EmployeeDataAccess extends BaseDataAccess {


    constructor() {
        super(CollectionName.EMPLOYEES);
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
            throw new Error("Cannot save user into DB.")
        }
    }

    public async removeParticipant(id: string, participantId: string) {
        const res = await this.db.collection(this.collection).updateOne({id: id}, {$pull: { participantIds: participantId}});
        if (res.acknowledged === false){
            throw new Error("Cannot save user into DB.")
        }
    }

    public async deleteEmployee(orgId: string, userId: string) {
        const res = await this.db.collection(this.collection).deleteOne({organisationId: orgId, userId: userId});
        if (res.acknowledged === false) {
            throw new Error("Cannot delete employee from DB.")
        }
    }

}