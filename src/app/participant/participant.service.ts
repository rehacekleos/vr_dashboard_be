import { BaseService } from "../../shared/services/Base.service";
import { ParticipantDataAccess } from "./participant.dataAccess";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { EmployeeService } from "../employee/employee.service";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { NewParticipant, Participant } from "./participant.model";
import { OrganisationDataAccess } from "../organisation/organisation.dataAccess";
import { User } from "../user/user.model";

export class ParticipantService extends BaseService {

    constructor(private participantDa: ParticipantDataAccess,
                private orgDa: OrganisationDataAccess,
                private employeeService: EmployeeService) {
        super();
    }

    public async getParticipantsForUserForOrganisation(orgId: string, userId: string) {
        const employee = await this.employeeService.getEmployeeForOrgAndUser(orgId, userId);
        if (isEmptyAndNull(employee)) {
            throw new HttpException(400, 'Employee not found.')
        }

        if (employee.participantIds.length < 1) {
            return [];
        }

        return await this.participantDa.getParticipantsByIds(employee.participantIds);
    }

    public async getParticipantForUser(userId: string) {
        const employees = await this.employeeService.getEmployeesForUser(userId);
        if (isEmptyAndNull(employees) || employees.length < 1) {
            throw new HttpException(400, 'Employees not found.')
        }

        const participantIdsSet = new Set<string>();

        for (const emp of employees) {
            for (const p of emp.participantIds) {
                participantIdsSet.add(p)
            }
        }

        const participantIds = Array.from(participantIdsSet);

        if (participantIds.length < 1) {
            return [];
        }

        return await this.participantDa.getParticipantsByIds(participantIds);
    }

    public async getParticipantById(id: string): Promise<Participant> {
        return await this.participantDa.getParticipantById(id);
    }

    public async createParticipant(newParticipant: NewParticipant, user: User): Promise<Participant> {
        const org = await this.orgDa.getOrganisationById(newParticipant.organisationId);
        if (isEmptyAndNull(org)) {
            throw new HttpException(400, "Organisation not found.");
        }

        const employee = await this.employeeService.getEmployeeForOrgAndUser(newParticipant.organisationId, user.id);
        if (isEmptyAndNull(employee)) {
            throw new HttpException(400, "User do not have access to organisation");
        }

        const participant = await this.participantDa.createParticipant(newParticipant);

        await this.employeeService.addParticipant(employee.id, participant.id);

        return participant;

    }

    public async updateParticipant(participant: Participant, user: User) {
        const par = await this.getParticipantById(participant.id);
        if (isEmptyAndNull(par)) {
            throw new HttpException(400, "Participant not found.");
        }

        const userParticipants = await this.getParticipantForUser(user.id);

        if (isEmptyAndNull(userParticipants.find(p => p.id === participant.id))) {
            throw new HttpException(400, "User do not have access to participant");
        }

        return await this.participantDa.updateParticipant(participant);
    }

    public async deleteParticipant(id: string, user: User) {
        const participant = await this.getParticipantById(id);
        if (isEmptyAndNull(participant)) {
            throw new HttpException(400, "Participant not found.");
        }
        const userParticipants = await this.getParticipantForUser(user.id);

        if (isEmptyAndNull(userParticipants.find(p => p.id === id))) {
            throw new HttpException(400, "User do not have access to participant");
        }

        await this.participantDa.deleteParticipant(id);
    }
}