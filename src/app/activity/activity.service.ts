import { BaseService } from "../../shared/services/Base.service";
import { ActivityDataAccess } from "./activity.dataAccess";
import { ApplicationService } from "../application/application.service";
import { Activity, NewActivity } from "./activity.model";
import { ParticipantDataAccess } from "../participant/participant.dataAccess";
import { HttpException, NoRequiredParameter, WrongBody } from "../../shared/exceptions/HttpException";
import { isEmptyAndNull } from "../../shared/utils/common.util";

export class ActivityService extends BaseService{

    constructor(private activityDa: ActivityDataAccess,
                private participantDa: ParticipantDataAccess,
                private applicationService: ApplicationService) {
        super();
    }

    public async getActivities(orgId: string, filters: { ids: string[] }): Promise<Activity[]>{
        if (filters.ids){
            return await this.activityDa.getActivitiesForOrganisationByIds(orgId, filters.ids);
        } else {
            return await this.activityDa.getActivitiesForOrganisation(orgId);
        }
    }

    public async getActivitiesForParticipant(participantId: string): Promise<Activity[]> {
        return await this.activityDa.getActivitiesForParticipant(participantId);
    }

    public async getActivity(activityId: string) {
        return await this.activityDa.getActivityById(activityId);
    }

    async createActivity(body: NewActivity, orgId: string): Promise<Activity> {
        const applications = await this.applicationService.getApplicationsForOrganisation(orgId);
        if (applications.length < 1) {
            throw new HttpException(400, "Application not exists");
        }
        const application = applications.find(a => a.id = body.applicationId);
        if (isEmptyAndNull(application)){
            throw new HttpException(400, "Application not exists");
        }

        if (!body.anonymous) {
            if (isEmptyAndNull(body.participantId)){
                throw new WrongBody('Activity')
            }

            const participants = await this.participantDa.getParticipantsForOrganisation(orgId);
            if (participants.length < 1) {
                throw new HttpException(400, "Participant not exists");
            }
            const participant = participants.find(p => p.id = body.participantId);
            if (isEmptyAndNull(application)) {
                throw new HttpException(400, "Participant not exists");
            }
        }

        return await this.activityDa.createActivity(body, orgId);
    }

    async updateActivityNote(activityId: string, newNote: string){
        const activity = await this.getActivity(activityId);
        if (isEmptyAndNull(activity)){
            throw new HttpException(400, "Activity not found");
        }

        await this.activityDa.updateNotes(activityId, newNote);
    }

    async deleteActivity(activityId: string) {
        const activity = await this.getActivity(activityId);
        if (isEmptyAndNull(activity)){
            throw new HttpException(400, "Activity not found");
        }

        await this.activityDa.deleteActivity(activityId);
    }
}