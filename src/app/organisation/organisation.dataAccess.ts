import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { v4 as uuid } from "uuid";
import { Organisation } from "./organisation.model";
import { generateCode } from "../../shared/utils/common.util";

/**
 * Singleton DataAccess for entity Organisation
 */
export class OrganisationDataAccess extends BaseDataAccess {

    /** Instance */
    private static instance: OrganisationDataAccess;

    /**
     * @constructor
     */
    constructor() {
        super(CollectionName.ORGANISATIONS);
    }

    public static getInstance(){
        if (!OrganisationDataAccess.instance){
            OrganisationDataAccess.instance = new OrganisationDataAccess();
        }
        return OrganisationDataAccess.instance;
    }

    public async getAllOrganisations(): Promise<Organisation[]> {
        return await this.db.collection(this.collection).find<Organisation>({}).toArray();
    }

    public async getOrganisationsByIds(ids: string[]): Promise<Organisation[]> {
        return await this.db.collection(this.collection).find<Organisation>({id: {$in: ids}}).toArray();
    }

    public async getOrganisationById(id: string): Promise<Organisation> {
        return await this.db.collection(this.collection).findOne<Organisation>({id: id});
    }

    public async getOrganisationByCode(code: string): Promise<Organisation> {
        return await this.db.collection(this.collection).findOne<Organisation>({code: code});
    }

    public async createOrganisation(name: string): Promise<Organisation>{
        const newOrganisation: Organisation = {
            id: uuid(),
            code: generateCode(6),
            name: name,
            applicationIds: []
        }

        const res = await this.db.collection(this.collection).insertOne(newOrganisation)
        if (res.acknowledged === false){
            throw new Error("Cannot save organisation into DB.")
        }

        return newOrganisation;
    }

    public async deleteOrganisation(id: string){
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete organisation from DB.")
        }
    }

}