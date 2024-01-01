// Base bootstrap class for server init.
// This class contains all shared operations with basic implementation for both subclasses.
// Do not use this class directly. Use it as parent class.
// Cloud version is used as base version, so little changes in cloud subclass.
import { IServerInstances } from "../interfaces/IServerInstances";
import { Server } from "../../server/server";
import express from 'express';
import { ConfigFactory } from '../../configs/factories/config.factory';
import { AuthService } from "../../app/auth/auth.service";
import { AuthController } from "../../app/auth/auth.controller";
import { OrganisationService } from "../../app/organisation/organisation.service";
import { OrganisationController } from "../../app/organisation/organisation.controller";
import { DefaultController } from "../../app/default/default.controller";
import { UserDataAccess } from "../../app/user/user.dataAccess";
import { OrganisationDataAccess } from "../../app/organisation/organisation.dataAccess";
import { EmployeeDataAccess } from "../../app/employee/employee.dataAccess";
import { EmployeeService } from "../../app/employee/employee.service";
import { ParticipantDataAccess } from "../../app/participant/participant.dataAccess";
import { ParticipantService } from "../../app/participant/participant.service";
import { ApplicationDataAccess } from "../../app/application/application.dataAccess";
import { InvitationController } from "../../app/invitation/invitation.controller";
import { InvitationService } from "../../app/invitation/invitation.service";
import { InvitationDataAccess } from "../../app/invitation/invitation.dataAccess";
import { ApplicationController } from "../../app/application/application.controller";
import { ApplicationService } from "../../app/application/application.service";
import { ParticipantController } from "../../app/participant/participant.controller";
import { EmployeeController } from "../../app/employee/employee.controller";
import { ActivityService } from "../../app/activity/activity.service";
import { ActivityDataAccess } from "../../app/activity/activity.dataAccess";
import { ActivityController } from "../../app/activity/activity.controller";
import { AdminService } from "../../app/admin/admin.service";
import { AdminController } from "../../app/admin/admin.controller";
import { ApplicationAssignmentDataAccess } from "../../app/application_assignment/application_assignment_data_access";
import { PublicService } from "../../app/public/public.service";
import { PublicController } from "../../app/public/public.controller";

/**
 * Bootstrap of the application.
 * The service and controller instances are created here and their dependencies are defined.
 */
export class ServerBaseBootstrap {

    protected workers: number;
    protected server: Server;

    /**
     * Define DataAccess
     */
    private userDa = UserDataAccess.getInstance();
    private orgDa = OrganisationDataAccess.getInstance();
    private employeeDa = EmployeeDataAccess.getInstance();
    private participantDa = new ParticipantDataAccess();
    private applicationDa = new ApplicationDataAccess();
    private invitationDa = new InvitationDataAccess();
    private activityDa = new ActivityDataAccess();
    private applicationAssignmentDa = new ApplicationAssignmentDataAccess()

    /**
     * Define services
     */
    private authService = new AuthService(this.userDa);
    private adminService = new AdminService(this.applicationDa, this.orgDa);
    private organisationService = new OrganisationService(this.orgDa, this.participantDa, this.applicationDa, this.employeeDa);
    private employeeService = new EmployeeService(this.employeeDa, this.userDa, this.orgDa);
    private participantService = new ParticipantService(this.participantDa, this.employeeService);
    private invitationService = new InvitationService(this.invitationDa, this.userDa, this.employeeService);
    private applicationService = new ApplicationService(this.applicationDa, this.applicationAssignmentDa, this.orgDa);
    private activityService = new ActivityService(this.activityDa, this.participantService, this.applicationService);
    private publicService = new PublicService(this.organisationService, this.applicationService, this.activityService, this.participantService);


    /**
     * Define controllers
     */
    private controllers = [
        new DefaultController(),
        new AuthController(this.authService),
        new OrganisationController(this.organisationService),
        new ApplicationController(this.applicationService),
        new ParticipantController(this.participantService),
        new InvitationController(this.invitationService),
        new EmployeeController(this.employeeService),
        new ActivityController(this.activityService),
        new AdminController(this.adminService),
        new PublicController(this.publicService)
    ]

    constructor() {
        this.workers = ConfigFactory.getConfig().defaultWorkers;
    }

    /**
     * Function that serves as a template for server init.
     * @protected
     *
     * @returns {Promise<IServerInstances>} Return value is promise due to async character of the method.
     */
    protected async start(): Promise<IServerInstances> {
        return;
    }

    /**
     * Base method for server init derivative from old cloud settings.
     * @protected
     *
     * @returns {express.Application}
     */
    protected initServer(): express.Application {
        const port = ConfigFactory.getConfig().defaultPort;

        this.server = new Server(port, this.controllers);

        this.server.listen();
        return this.server.app;
    }
}
