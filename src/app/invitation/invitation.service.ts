import { BaseService } from "../../shared/services/Base.service";
import { InvitationDataAccess } from "./invitation.dataAccess";
import { AcceptInvitation, Invitation, NewInvitation } from "./invitation.model";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException, WrongBody } from "../../shared/exceptions/HttpException";
import dayjs from "dayjs";
import { EmployeeService } from "../employee/employee.service";
import { RoleNames } from "../../models/role.model";
import { Employee, NewEmployee } from "../employee/employee.model";
import { User } from "../user/user.model";
import { UserDataAccess } from "../user/user.dataAccess";

export class InvitationService extends BaseService{

    constructor(private invDa: InvitationDataAccess,
                private userDa: UserDataAccess,
                private employeeService: EmployeeService) {
        super();
    }

    public async getInvitationsForOrg(orgId: string): Promise<Invitation[]> {
        return await this.invDa.getInvitationsForOrg(orgId);
    }

    public async acceptInvitation(inv: AcceptInvitation, user: User) {
        if (isEmptyAndNull(inv.code)){
            throw new WrongBody('Invitation')
        }
        const existingInvitation = await this.invDa.getInvitationForCodeAndUser(inv.code, user.email);
        if (isEmptyAndNull(existingInvitation)){
            throw new HttpException(400, 'Invitation not found.')
        }

        if (this.isInvitationExpired(existingInvitation)){
            throw new HttpException(400, 'Invitation is expired.')
        }

        const newEmpl: NewEmployee = {
            organisationId: existingInvitation.organisationId,
            userId: user.id,
            role: {
                name: existingInvitation.role
            }
        }
        await this.employeeService.createEmployee(newEmpl);
        await this.invDa.deleteInvitation(existingInvitation.id);
    }

    public async createInvitation(newInv: NewInvitation, orgId: string, user: User, emp: Employee): Promise<Invitation> {
        if (isEmptyAndNull(newInv.email) || isEmptyAndNull(newInv.role)){
            throw new WrongBody('Invitation')
        }

        if (!user.superAdmin) {
            if (emp?.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }

        const inv = await this.invDa.getInvitationForOrgAndUser(orgId, newInv.email);
        if (!isEmptyAndNull(inv)){
            throw new HttpException(400, 'Invitation already exists.')
        }

        const invitedUser = await this.userDa.getUserByEmail(newInv.email);
        if (!isEmptyAndNull(invitedUser)){
            const checkEmpl = await this.employeeService.getEmployeeForOrgAndUser(orgId, invitedUser.id);
            if (!isEmptyAndNull(checkEmpl)){
                throw new HttpException(400, 'Employee already exists.')
            }
        }

        return await this.invDa.createInvitation(newInv, orgId);
    }

    public async extendInvitation(id: string, user: User, emp: Employee): Promise<Invitation>{
        if (!user.superAdmin){
            if (emp?.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }
        const inv = await this.invDa.getInvitationById(id);
        if (isEmptyAndNull(inv)){
            throw new HttpException(400, 'Invitation not found!')
        }

        return await this.invDa.extendInvitation(id);
    }

    public async deleteInvitation(id: string, user: User, emp: Employee) {
        if (!user.superAdmin){
            if (emp?.role.name !== RoleNames.ADMIN){
                throw new HttpException(400, "You are not admin of this organisation.");
            }
        }
        const inv = await this.invDa.getInvitationById(id);
        if (isEmptyAndNull(inv)){
            throw new HttpException(400, 'Invitation not found!')
        }
        await this.invDa.deleteInvitation(id);
    }


    /**
     * Return true if invitation is older than 15 minutes
     * @param invitation
     * @private
     */
    private isInvitationExpired(invitation: Invitation): boolean {
        const now = dayjs();
        const created = dayjs(invitation.time);

        return now.diff(created, 'minute', true) > 30
    }

}