import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { NewParticipant, Participant } from "./participant.model";
import { v4 as uuid } from "uuid";

/**
 * DataAccess for entity Participant
 */
export class ParticipantDataAccess extends BaseDataAccess{

    /**
     *
     */
    constructor() {
        super(CollectionName.PARTICIPANTS);
    }

    public async getParticipantById(id: string): Promise<Participant> {
        return await this.db.collection(this.collection).findOne<Participant>({id: id});
    }

    public async getParticipantsByIds(ids: string[]): Promise<Participant[]> {
        return await this.db.collection(this.collection).find<Participant>({id: {$in: ids}}).toArray();
    }

    public async getParticipantsForOrganisation(orgId: string): Promise<Participant[]> {
        return await this.db.collection(this.collection).find<Participant>({organisationId: orgId}).toArray();
    }

    public async createParticipant(participant: NewParticipant, orgId: string): Promise<Participant> {
        const newParticipant: Participant = {
            id: uuid(),
            organisationId: orgId,
            ...participant
        }

        const res = await this.db.collection(this.collection).insertOne(newParticipant)
        if (res.acknowledged === false){
            throw new Error("Cannot save participant into DB.")
        }

        return newParticipant;
    }

    public async updateParticipant(participant: Participant) {
        const res = await this.db.collection(this.collection).replaceOne({id: participant.id}, participant);
        if (res.acknowledged === false){
            throw new Error("Cannot update participant in DB.")
        }
    }

    public async deleteParticipant(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete participant from DB.")
        }
    }
}