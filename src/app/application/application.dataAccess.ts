import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Application, NewApplication } from "./application.model";
import { v4 as uuid } from "uuid";
import { generateCode } from "../../shared/utils/common.util";
import { Activity } from "../activity/activity.model";

export class ApplicationDataAccess extends BaseDataAccess {
    private static instance: ApplicationDataAccess;

    constructor() {
        super(CollectionName.APPLICATIONS);
    }

    public static getInstance(){
        if (!ApplicationDataAccess.instance){
            ApplicationDataAccess.instance = new ApplicationDataAccess();
        }
        return ApplicationDataAccess.instance;
    }

    async getApplication(id: string): Promise<Application> {
        return await this.db.collection(this.collection).findOne<Application>({id: id});
    }

    async getApplicationsForOrganisation(orgId: string): Promise<Application[]> {
        return await this.db.collection(this.collection).find<Application>({organisationId: orgId}).toArray();
    }

    async createApplication(application: NewApplication, orgId: string): Promise<Application> {
        const newApplication: Application = {
            id: uuid(),
            code: generateCode(),
            organisationId: orgId,
            ...application
        }

        const res = await this.db.collection(this.collection).insertOne(newApplication)
        if (res.acknowledged === false){
            throw new Error("Cannot save application into DB.")
        }

        return newApplication;
    }

    async updateSetting(id: string, setting: any): Promise<Application> {
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {setting: setting}}, {returnDocument: "after"});
        if (!res.ok){
            throw new Error("Cannot update setting.")
        }
        return res.value as any as Application
    }

    async deleteApplication(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete application from DB.")
        }
    }

}