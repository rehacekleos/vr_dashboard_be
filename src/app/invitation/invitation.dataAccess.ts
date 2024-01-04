import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { RoleNames } from "../../models/role.model";
import { Invitation, NewInvitation } from "./invitation.model";
import { v4 as uuid } from "uuid";
import { generateCode } from "../../shared/utils/common.util";
import dayjs from "dayjs";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";

/**
 * DataAccess for entity Invitation
 */
export class InvitationDataAccess extends BaseDataAccess {
    /**
     *
     */
    constructor() {
        super(CollectionName.INVITATIONS);
    }

    public async getInvitationById(id: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({id: id})
    }

    public async getInvitationForOrgAndUser(orgId: string, email: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({organisationId: orgId, email: email})
    }

    public async getInvitationsForOrg(orgId: string): Promise<Invitation[]> {
        return await this.db.collection(this.collection).find<Invitation>({organisationId: orgId}).toArray()
    }

    public async getInvitationForCodeAndUser(code: string, email: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({code: code, email: email})
    }

    public async extendInvitation(id: string): Promise<Invitation>{
        const now = dayjs().toISOString();
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {time: now}});
        if (!res.ok) {
            throw new Error("Cannot update invitation.")
        }
        return res.value as any as Invitation
    }

    public async createInvitation(newInv: NewInvitation, orgId: string): Promise<Invitation> {
        const newInvitation: Invitation = {
            id: uuid(),
            code: generateCode(),
            organisationId: orgId,
            email: newInv.email,
            role: newInv.role as RoleNames,
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