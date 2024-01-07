import { BaseService } from "../../shared/services/Base.service";
import { ParticipantDataAccess } from "./participant.dataAccess";
import { EmployeeService } from "../employee/employee.service";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { NewParticipant, Participant, ParticipantMetadata, ParticipantsMetadataList } from "./participant.model";
import { User } from "../user/user.model";
import { Employee } from "../employee/employee.model";

/**
 * Service for entity Participant
 */
export class ParticipantService extends BaseService {

    /**
     * @constructor
     * @param participantDa
     * @param employeeService
     */
    constructor(private participantDa: ParticipantDataAccess,
                private employeeService: EmployeeService) {
        super();
    }

    public async getParticipantsForOrganisation(orgId: string): Promise<Participant[]> {
        return await this.participantDa.getParticipantsForOrganisation(orgId);
    }

    public async getParticipants(orgId: string, user: User, emp: Employee): Promise<Participant[]> {
        if (user.superAdmin) {
            return await this.participantDa.getParticipantsForOrganisation(orgId);
        }
        return this.getParticipantsEmployee(emp);
    }

    public async getParticipantsEmployee(employee: Employee) {
        if (isEmptyAndNull(employee) || employee.participantIds.length < 1) {
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

    public async createParticipant(newParticipant: NewParticipant, employee: Employee): Promise<Participant> {
        if (isEmptyAndNull(employee)) {
            throw new HttpException(400, "User is not an employee.");
        }

        const participant = await this.participantDa.createParticipant(newParticipant, employee.organisationId);
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

    async getParticipantsMetadata(orgCode: string): Promise<ParticipantsMetadataList> {
        const participants = await this.participantDa.getParticipantsForOrganisation(orgCode);
        const metadata: ParticipantMetadata[] = participants.map(p => {
            return {
                id: p.id,
                nickname: p.nickname
            }
        });

        return {participants: metadata};
    }
}