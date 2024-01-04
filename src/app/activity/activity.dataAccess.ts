import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Activity, CompressedActivity, NewActivity } from "./activity.model";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { sortDate } from "../../shared/utils/common.util";

/**
 * DataAccess for entity Activity
 */
export class ActivityDataAccess extends BaseDataAccess {
    /**
     *
     */
    constructor() {
        super(CollectionName.ACTIVITIES);
    }

    public async getActivityById(id: string): Promise<Activity> {
        const res =  await this.db.collection(this.collection).findOne<Activity>({id: id});
        return this.decompressVRData(res);
    }

    async getActivitiesForOrganisation(orgId: string) {
        const res =  await this.db.collection(this.collection).find<Activity>({organisationId: orgId}, {projection: {"data.records": 0}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    async getActivitiesForOrganisationByIds(orgId: string, ids: string[]) {
        const res =  await this.db.collection(this.collection).find<Activity>({organisationId: orgId, id: {$in: ids}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    public async getActivitiesForApplication(applicationId: string): Promise<Activity[]> {
        const res =  await this.db.collection(this.collection).find<Activity>({applicationId: applicationId}, {projection: {"data.records": 0}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    public async getActivitiesForApplicationIds(applicationIds: string[]): Promise<Activity[]> {
        const res =  await this.db.collection(this.collection).find<Activity>({applicationId: {$in: applicationIds}}, {projection: {"data.records": 0}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    public async getActivitiesForParticipant(participantId: string): Promise<Activity[]> {
        const res = await this.db.collection(this.collection).find<Activity>({participantId: participantId},{projection: {"data.records": 0}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    async getActivitiesForParticipantsByIds(participantsIds: string[]) {
        const res = await this.db.collection(this.collection).find<Activity>({participantId: {$in: participantsIds}},{projection: {"data.records": 0}}).toArray();
        return res.map(r => this.decompressVRData(r)).sort((a,b) => sortDate(a.data.start, b.data.start));
    }

    public async createActivity(activity: NewActivity, orgId: string): Promise<Activity> {
        const newActivity: Activity = {
            id: uuid(),
            participantId: activity.participantId,
            time: dayjs().toISOString(),
            data: activity.data,
            applicationId: activity.applicationId,
            notes: activity.notes,
            anonymous: activity.anonymous,
            organisationId: orgId
        }

        const compressActivity = this.compressVRData(newActivity)

        const res = await this.db.collection(this.collection).insertOne(compressActivity)
        if (res.acknowledged === false) {
            throw new Error("Cannot save activity into DB.")
        }

        return newActivity;
    }

    public async updateNotes(id: string, notes: string): Promise<Activity> {
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {notes: notes}}, {returnDocument: "after"});
        if (!res.ok) {
            throw new Error("Cannot update notes.")
        }
        return res.value as any as Activity
    }

    public async deleteActivity(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false) {
            throw new Error("Cannot delete activity from DB.")
        }
    }

    private compressVRData(activity: Activity): CompressedActivity{
        const copy: CompressedActivity = {...activity};
        copy.data.records = JSON.stringify(copy.data.records);
        return copy;
    }

    private decompressVRData(activity: CompressedActivity): Activity{
        const copy = {...activity};
        if (copy.data.records) {
            copy.data.records = JSON.parse(copy.data.records);
        }
        return copy;
    }



}