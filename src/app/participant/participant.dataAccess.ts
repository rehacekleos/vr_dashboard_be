import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { NewParticipant, Participant } from "./participant.model";
import { v4 as uuid } from "uuid";

export class ParticipantDataAccess extends BaseDataAccess{

    private static instance: ParticipantDataAccess;

    constructor() {
        super(CollectionName.PARTICIPANTS);
    }

    public static getInstance() {
        if (!ParticipantDataAccess.instance){
            ParticipantDataAccess.instance = new ParticipantDataAccess();
        }
        return ParticipantDataAccess.instance;
    }

    async getParticipantById(id: string): Promise<Participant> {
        return await this.db.collection(this.collection).findOne<Participant>({id: id});
    }

    async getParticipantsForOrganisation(orgId: string): Promise<Participant[]> {
        return await this.db.collection(this.collection).find<Participant>({organisationId: orgId}).toArray();
    }

    async createParticipant(participant: NewParticipant, orgId: string): Promise<Participant> {
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

    async updateParticipant(participant: Participant) {
        const res = await this.db.collection(this.collection).replaceOne({id: participant.id}, participant);
        if (res.acknowledged === false){
            throw new Error("Cannot update participant in DB.")
        }
    }

    async deleteParticipant(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete participant from DB.")
        }
    }
}