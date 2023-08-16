import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { Role } from "../../models/role.model";
import { Invitation, NewInvitation } from "./invitation.model";
import { v4 as uuid } from "uuid";
import { generateCode } from "../../shared/utils/common.util";
import dayjs from "dayjs";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";

export class InvitationDataAccess extends BaseDataAccess {
    constructor() {
        super(CollectionName.INVITATIONS);
    }

    public async getInvitationById(id: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({id: id})
    }

    public async getInvitationForOrgAndUser(orgId: string, userId: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({organisationId: orgId, userId: userId})
    }

    public async extendInvitation(id: string): Promise<Invitation>{
        const now = dayjs().toISOString();
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {time: now}});
        if (!res.ok) {
            throw new Error("Cannot update invitation.")
        }
        return res.value as any as Invitation
    }

    public async createInvitation(newInv: NewInvitation): Promise<Invitation> {
        const newInvitation: Invitation = {
            id: uuid(),
            code: generateCode(),
            organisationId: newInv.organisationId,
            userId: newInv.userId,
            role: newInv.role,
            time: dayjs().toISOString()
        }

        const res = await this.db.collection(this.collection).insertOne(newInvitation)
        if (res.acknowledged === false){
            throw new Error("Cannot save invitation into DB.")
        }

        return newInvitation;
    }

    public async deleteInvitation(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete invitation from DB.")
        }
    }
}