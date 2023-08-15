import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { Role } from "../../models/role.model";
import { Invitation } from "./invitation.model";
import { v4 as uuid } from "uuid";
import { generateCode } from "../../shared/utils/common.util";
import dayjs from "dayjs";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";

export class InvitationDataAccess extends BaseDataAccess {
    private static instance: InvitationDataAccess;

    constructor() {
        super(CollectionName.INVITATIONS);
    }

    public static getInstance() {
        if (!InvitationDataAccess.instance){
            InvitationDataAccess.instance = new InvitationDataAccess();
        }
        return InvitationDataAccess.instance;
    }

    async getInvitationById(id: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({id: id})
    }

    async getInvitationByCode(code: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({code: code})
    }

    async getInvitationForOrgAndUser(orgId: string, userId: string): Promise<Invitation> {
        return await this.db.collection(this.collection).findOne<Invitation>({organisationId: orgId, userId: userId})
    }

    async createInvitation(orgId: string, userId: string, role: Role): Promise<Invitation> {
        const newInvitation: Invitation = {
            id: uuid(),
            code: generateCode(),
            organisationId: orgId,
            userId: userId,
            role: role,
            time: dayjs().toISOString()
        }

        const res = await this.db.collection(this.collection).insertOne(newInvitation)
        if (res.acknowledged === false){
            throw new Error("Cannot save invitation into DB.")
        }

        return newInvitation;
    }

    async deleteInvitation(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete invitation from DB.")
        }
    }
}