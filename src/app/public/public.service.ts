import { BaseService } from "../../shared/services/Base.service";
import { OrganisationService } from "../organisation/organisation.service";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import { ApplicationService } from "../application/application.service";
import { ActivityService } from "../activity/activity.service";
import { NewActivity, SendActivity, VRData } from "../activity/activity.model";
import { ParticipantService } from "../participant/participant.service";
import { ParticipantsMetadataList } from "../participant/participant.model";

export class PublicService extends BaseService{

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

        return await this.participantService.GetParticipantsMetadata(org.id);
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
}