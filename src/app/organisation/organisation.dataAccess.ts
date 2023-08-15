import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { v4 as uuid } from "uuid";
import { Organisation } from "./organisation.model";
import { User } from "../user/user.model";
import { generateCode, isEmptyAndNull } from "../../shared/utils/common.util";

export class OrganisationDataAccess extends BaseDataAccess {

    private static instance: OrganisationDataAccess;

    constructor() {
        super(CollectionName.ORGANISATIONS);
    }

    public static getInstance() {
        if (!OrganisationDataAccess.instance){
            OrganisationDataAccess.instance = new OrganisationDataAccess();
        }
        return OrganisationDataAccess.instance;
    }

    async getOrganisationsByIds(ids: string[]): Promise<Organisation[]> {
        return await this.db.collection(this.collection).find<Organisation>({id: {$in: ids}}).toArray();
    }

    async getOrganisationById(id: string): Promise<Organisation> {
        return await this.db.collection(this.collection).findOne<Organisation>({id: id});
    }

    async getOrganisationByCode(code: string): Promise<Organisation> {
        return await this.db.collection(this.collection).findOne<Organisation>({code: code});
    }

    async createOrganisation(name: string, userId?: string): Promise<Organisation>{
        const newOrganisation: Organisation = {
            id: uuid(),
            code: generateCode(),
            name: name,
            applicationIds: []
        }

        const res = await this.db.collection(this.collection).insertOne(newOrganisation)
        if (res.acknowledged === false){
            throw new Error("Cannot save organisation into DB.")
        }

        return newOrganisation;
    }

}