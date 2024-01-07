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

    /**
     * Get all Participants for Organisation
     * @param orgId
     * @returns {Promise<Participant[]>}
     */
    public async getParticipantsForOrganisation(orgId: string): Promise<Participant[]> {
        return await this.participantDa.getParticipantsForOrganisation(orgId);
    }

    /**
     * Get all Participants for superAdmin or for Employee
     * @param orgId
     * @param user
     * @param emp
     * @returns {Promise<Participant[]>}
     */
    public async getParticipants(orgId: string, user: User, emp: Employee): Promise<Participant[]> {
        if (user.superAdmin) {
            return await this.participantDa.getParticipantsForOrganisation(orgId);
        }
        return this.getParticipantsEmployee(emp);
    }

    /**
     * Get all Participants for Employee
     * @param employee
     * @returns {Promise<Participant[]>}
     */
    public async getParticipantsEmployee(employee: Employee): Promise<Participant[]> {
        if (isEmptyAndNull(employee) || employee.participantIds.length < 1) {
            return [];
        }

        return await this.participantDa.getParticipantsByIds(employee.participantIds);
    }

    /**
     * Get all Participants for User
     * @param userId
     * @returns {Promise<Participant[]>}
     */
    public async getParticipantForUser(userId: string): Promise<Participant[]> {
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

    /**
     * Get Participant by ID
     * @param id
     * @returns {Promise<Participant>}
     */
    public async getParticipantById(id: string): Promise<Participant> {
        return await this.participantDa.getParticipantById(id);
    }

    /**
     * Create new Participant and add him to Employee
     * @param newParticipant
     * @param employee
     * @returns {Promise<Participant>}
     */
    public async createParticipant(newParticipant: NewParticipant, employee: Employee): Promise<Participant> {
        if (isEmptyAndNull(employee)) {
            throw new HttpException(400, "User is not an employee.");
        }

        const participant = await this.participantDa.createParticipant(newParticipant, employee.organisationId);
        await this.employeeService.addParticipant(employee.id, participant.id);
        return participant;
    }

    /**
     * Update Participant
     * @param participant
     * @param user
     * @returns {Promise<void>}
     */
    public async updateParticipant(participant: Participant, user: User): Promise<void> {
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

    /**
     * Delete Participant
     * @param id
     * @param user
     * @returns {Promise<void>}
     */
    public async deleteParticipant(id: string, user: User): Promise<void> {
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

    /**
     * Get Participant metadata list for Organisation
     * @param orgCode
     * @returns {Promise<ParticipantsMetadataList>}
     */
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