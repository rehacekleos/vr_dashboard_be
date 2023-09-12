import { BaseService } from "../../shared/services/Base.service";
import { ActivityDataAccess } from "./activity.dataAccess";
import { ApplicationService } from "../application/application.service";
import { Activity } from "./activity.model";

export class ActivityService extends BaseService{

    constructor(private activityDa: ActivityDataAccess,
                private applicationService: ApplicationService) {
        super();
    }

    public async getActivities(orgId: string): Promise<Activity[]>{
        const applications = await this.applicationService.getApplicationsForOrganisation(orgId);
        if (applications.length < 1) {
            return [];
        }

        const applicationIds = applications.map(a => a.id);

        return await this.activityDa.getActivitiesForApplicationIds(applicationIds);
    }
}