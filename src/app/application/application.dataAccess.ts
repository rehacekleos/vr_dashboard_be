import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Application, NewApplication } from "./application.model";
import { v4 as uuid } from "uuid";
import { generateCode } from "../../shared/utils/common.util";
import { Activity } from "../activity/activity.model";

export class ApplicationDataAccess extends BaseDataAccess {
    constructor() {
        super(CollectionName.APPLICATIONS);
    }

    public async getApplication(id: string): Promise<Application> {
        return await this.db.collection(this.collection).findOne<Application>({id: id});
    }

    public async getApplicationsForOrganisation(orgId: string): Promise<Application[]> {
        return await this.db.collection(this.collection).find<Application>({organisationId: orgId}).toArray();
    }

    public async createApplication(application: NewApplication): Promise<Application> {
        const newApplication: Application = {
            id: uuid(),
            code: generateCode(),
            ...application
        }

        const res = await this.db.collection(this.collection).insertOne(newApplication)
        if (res.acknowledged === false){
            throw new Error("Cannot save application into DB.")
        }

        return newApplication;
    }

    public async updateSetting(id: string, setting: any): Promise<Application> {
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {setting: setting}}, {returnDocument: "after"});
        if (!res.ok){
            throw new Error("Cannot update setting.")
        }
        return res.value as any as Application
    }

    public async deleteApplication(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete application from DB.")
        }
    }

}