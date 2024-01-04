import { BaseService } from "../../shared/services/Base.service";
import { OrganisationService } from "../organisation/organisation.service";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { ApplicationService } from "../application/application.service";
import { ActivityService } from "../activity/activity.service";
import { SendActivity, VRData } from "../activity/activity.model";
import { ParticipantService } from "../participant/participant.service";
import { ParticipantsMetadataList } from "../participant/participant.model";

/**
 * Service for public controller
 */
export class PublicService extends BaseService{

    /**
     *
     * @param organisationService
     * @param applicationService
     * @param activityService
     * @param participantService
     */
    constructor(private organisationService: OrganisationService,
                private applicationService: ApplicationService,
                private activityService: ActivityService,
                private participantService: ParticipantService) {
        super();
    }

    async getActivityVrData(applicationIdentifier: string, orgCode: string, activityId: string, environmentId: string): Promise<VRData> {
        const org = await this.organisationService.getOrganisationByCode(orgCode);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, `Organisation with code: ${orgCode} not found.`);
        }

        const applicationsForOrg = await this.applicationService.getApplicationsForOrganisation(org.id);
        const application = applicationsForOrg.find(a => a.identifier === applicationIdentifier);

        if (isEmptyAndNull(application)){
            throw new HttpException(400, `Application with identifier: ${applicationIdentifier} not found or not associated with Organisation.`);
        }

        const activity = await this.activityService.getActivity(activityId);
        if (isEmptyAndNull(activity)){
            throw new HttpException(400, `Activity not found.`);
        }

        if (activity.organisationId !== org.id || activity.applicationId !== application.id){
            throw new HttpException(400, "Activity does not belong to an organisation or application.")
        }

        const VRData = activity.data;
        if (environmentId) {
            VRData.records = VRData.records.filter(r => r.environment.toString() === environmentId.toString());
        }

        return VRData;
    }

    async getParticipants(applicationIdentifier: string, orgCode: string): Promise<ParticipantsMetadataList> {
        const org = await this.organisationService.getOrganisationByCode(orgCode);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, `Organisation with code: ${orgCode} not found.`);
        }

        const applicationsForOrg = await this.applicationService.getApplicationsForOrganisation(org.id);
        const application = applicationsForOrg.find(a => a.identifier === applicationIdentifier);

        if (isEmptyAndNull(application)){
            throw new HttpException(400, `Application with identifier: ${applicationIdentifier} not found or not associated with Organisation.`);
        }

        return await this.participantService.getParticipantsMetadata(org.id);
    }

    async saveNewActivity(applicationIdentifier: string, activity: SendActivity) {
        if (isEmptyAndNull(activity.organisation_code)){
            throw new WrongBody("Activity", "Organisation code is not defined");
        }

        const org = await this.organisationService.getOrganisationByCode(activity.organisation_code);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, `Organisation with code: ${activity.organisation_code} not found.`);
        }

        const applicationsForOrg = await this.applicationService.getApplicationsForOrganisation(org.id);
        const application = applicationsForOrg.find(a => a.identifier === applicationIdentifier);

        if (isEmptyAndNull(application)){
            throw new HttpException(400, `Application with identifier: ${applicationIdentifier} not found or not associated with Organisation.`);
        }

        if (applicationIdentifier !== activity.data.application_identifier){
            throw new WrongBody("Activity", "Different applicationIdentifier");
        }

        await this.activityService.createSendActivity(activity, application.id, org.id);

    }

    async getActivities(applicationIdentifier: string, orgCode: string, participantId: string) {
        const org = await this.organisationService.getOrganisationByCode(orgCode);
        if (isEmptyAndNull(org)){
            throw new HttpException(400, `Organisation with code: ${orgCode} not found.`);
        }

        const applicationsForOrg = await this.applicationService.getApplicationsForOrganisation(org.id);
        const application = applicationsForOrg.find(a => a.identifier === applicationIdentifier);

        if (isEmptyAndNull(application)){
            throw new HttpException(400, `Application with identifier: ${applicationIdentifier} not found or not associated with Organisation.`);
        }

        const participants = await this.participantService.getParticipantsForOrganisation(org.id);
        if (isEmptyAndNull(participants.find(p => p.id == participantId))){
            throw new HttpException(400, `Participant with id: ${participantId} not found or not associated with Organisation.`);
        }

        const activities = await this.activityService.getActivitiesForParticipant(participantId);
        return activities.filter(a => a.organisationId === org.id && a.applicationId === application.id);
    }
}