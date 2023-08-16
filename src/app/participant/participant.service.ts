import { BaseService } from "../../shared/services/Base.service";
import { ParticipantDataAccess } from "./participant.dataAccess";
import { EmployeeDataAccess } from "../employee/employee.dataAccess";
import { EmployeeService } from "../employee/employee.service";
import { isEmptyAndNull } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";

export class ParticipantService extends BaseService{

    constructor(private participantDa: ParticipantDataAccess,
                private employeeService: EmployeeService) {
        super();
    }

    public async getParticipantForUser(orgId: string, userId: string){
        const employee = await this.employeeService.getEmployeeForOrgAndUser(orgId, userId);
        if (isEmptyAndNull(employee)){
            throw new HttpException(400, 'Employee not found.')
        }

        if (employee.participantIds.length < 1){
            return [];
        }

        return await this.participantDa.getParticipantsByIds(employee.participantIds);
    }
}