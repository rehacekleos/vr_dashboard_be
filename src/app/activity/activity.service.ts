import { BaseService } from "../../shared/services/Base.service";
import { ActivityDataAccess } from "./activity.dataAccess";
import { ApplicationService } from "../application/application.service";
import { Activity, NewActivity, SendActivity } from "./activity.model";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { User } from "../user/user.model";
import { ParticipantService } from "../participant/participant.service";
import { Employee } from "../employee/employee.model";

/**
 * Service for entity Activity
 */
export class ActivityService extends BaseService{

    /**
     * @constructor
     * @param activityDa
     * @param participantService
     * @param applicationService
     */
    constructor(private activityDa: ActivityDataAccess,
                private participantService: ParticipantService,
                private applicationService: ApplicationService) {
        super();
    }

    /**
     * Get Activities by filters or by Employee participants
     * @param orgId
     * @param filters
     * @param user
     * @param emp
     * @returns {Promise<Activity[]>}
     */
    public async getActivities(orgId: string, filters: { ids: string[] }, user: User, emp: Employee): Promise<Activity[]>{
        if (filters.ids){
            return await this.activityDa.getActivitiesForOrganisationByIds(orgId, filters.ids);
        } else {
            if (user.superAdmin) {
                return await this.activityDa.getActivitiesForOrganisation(orgId);
            } else {
                return await this.activityDa.getActivitiesForParticipantsByIds(emp.participantIds);
            }
        }
    }

    /**
     * Get activities for Participant
     * @param participantId
     * @returns {Promise<Activity[]>}
     */
    public async getActivitiesForParticipant(participantId: string): Promise<Activity[]> {
        return await this.activityDa.getActivitiesForParticipant(participantId);
    }

    /**
     * Get Activity by ID
     * @param activityId
     * @returns {Promise<Activity>}
     */
    public async getActivity(activityId: string): Promise<Activity> {
        return await this.activityDa.getActivityById(activityId);
    }

    /**
     * Create new Activity from Client App
     * @param body
     * @param orgId
     * @returns {Promise<Activity>}
     */
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

            const participants = await this.participantService.getParticipantsForOrganisation(orgId);
            if (participants.length < 1) {
                throw new HttpException(400, "Participant not exists");
            }
            const participant = participants.find(p => p.id = body.participantId);
            if (isEmptyAndNull(participant)) {
                throw new HttpException(400, "Participant not exists");
            }
        }

        return await this.activityDa.createActivity(body, orgId);
    }

    /**
     * Create new Activity from VR dashboard Logger
     * @param activity
     * @param applicationId
     * @param organisationId
     * @returns {Promise<activity>}
     */
    async createSendActivity(activity: SendActivity, applicationId: string, organisationId: string): Promise<Activity>{
        if (!activity.anonymous) {
            if (isEmptyAndNull(activity.participantId)){
                throw new WrongBody('Activity')
            }

            const participants = await this.participantService.getParticipantsForOrganisation(organisationId);
            if (participants.length < 1) {
                throw new HttpException(400, "Participant not exists");
            }
            const participant = participants.find(p => p.id = activity.participantId);
            if (isEmptyAndNull(participant)) {
                throw new HttpException(400, "Participant not exists");
            }
        }

        const newActivity: NewActivity = {
            data: activity.data,
            participantId: activity.participantId,
            anonymous: activity.anonymous,
            notes: "",
            applicationId: applicationId
        }

        return await this.activityDa.createActivity(newActivity, organisationId);
    }

    /**
     * Update Activity note
     * @param activityId
     * @param newNote
     * @returns void
     */
    async updateActivityNote(activityId: string, newNote: string){
        const activity = await this.getActivity(activityId);
        if (isEmptyAndNull(activity)){
            throw new HttpException(400, "Activity not found");
        }

        await this.activityDa.updateNotes(activityId, newNote);
    }

    /**
     * Delete Activity
     * @param activityId
     * @returns void
     */
    async deleteActivity(activityId: string) {
        const activity = await this.getActivity(activityId);
        if (isEmptyAndNull(activity)){
            throw new HttpException(400, "Activity not found");
        }

        await this.activityDa.deleteActivity(activityId);
    }
}