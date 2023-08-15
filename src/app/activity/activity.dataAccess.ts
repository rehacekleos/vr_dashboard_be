import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { Activity, NewActivity } from "./activity.model";
import { v4 as uuid } from "uuid";
import { Participant } from "../participant/participant.model";

export class ActivityDataAccess extends BaseDataAccess {
    private static instance: ActivityDataAccess;

    constructor() {
        super(CollectionName.ACTIVITIES);
    }

    public static getInstance() {
        if (!ActivityDataAccess.instance){
            ActivityDataAccess.instance = new ActivityDataAccess();
        }
        return ActivityDataAccess.instance;
    }

    async getActivityById(id: string): Promise<Activity> {
        return await this.db.collection(this.collection).findOne<Activity>({id: id});
    }

    async getActivitiesForApplication(applicationId: string): Promise<Activity[]> {
        return await this.db.collection(this.collection).find<Activity>({applicationId: applicationId}).toArray();
    }

    async getActivitiesForParticipant(participantId: string): Promise<Activity[]> {
        return await this.db.collection(this.collection).find<Activity>({participantId: participantId}).toArray();
    }

    async createActivity(activity: NewActivity, participantId: string): Promise<Activity> {
        const newActivity: Activity = {
            id: uuid(),
            participantId: participantId,
            time: activity.time,
            data: activity.data,
            applicationId: activity.applicationId,
            notes: activity.notes
        }

        const res = await this.db.collection(this.collection).insertOne(newActivity)
        if (res.acknowledged === false){
            throw new Error("Cannot save activity into DB.")
        }

        return newActivity;
    }

    async updateNotes(id: string, notes: string): Promise<Activity> {
        const res = await this.db.collection(this.collection).findOneAndUpdate({id: id}, {$set: {notes: notes}}, {returnDocument: "after"});
        if (!res.ok){
            throw new Error("Cannot update notes.")
        }
        return res.value as any as Activity
    }

    async deleteActivity(id: string) {
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete activity from DB.")
        }
    }

}