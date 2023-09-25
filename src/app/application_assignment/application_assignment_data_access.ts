import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { ApplicationAssignment } from "./application_assignment.model";

export class ApplicationAssignmentDataAccess extends BaseDataAccess{

    constructor() {
        super(CollectionName.APPLICATION_ASSIGNMENT);
    }

    async getAssignmentsByOrgId(orgId: string): Promise<ApplicationAssignment[]> {
        return await this.db.collection(this.collection).find<ApplicationAssignment>({organisationId: orgId}).toArray();
    }
}