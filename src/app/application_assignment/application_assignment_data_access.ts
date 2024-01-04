import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { ApplicationAssignment } from "./application_assignment.model";

/**
 * DataAccess for entity Application Assignment
 */
export class ApplicationAssignmentDataAccess extends BaseDataAccess{

    constructor() {
        super(CollectionName.APPLICATION_ASSIGNMENT);
    }

    async getAssignmentsByOrgId(orgId: string): Promise<ApplicationAssignment[]> {
        return await this.db.collection(this.collection).find<ApplicationAssignment>({organisationId: orgId}).toArray();
    }

    async createAssignment(applicationId: string, orgId: string) {
        await this.db.collection(this.collection).insertOne({organisationId: orgId, applicationId: applicationId});
    }
}