import { Role } from "../../models/role.model";
import { User } from "../user/user.model";

export class Employee {
    id: string
    organisationId: string
    userId: string
    role: Role
    user?: User

    participantIds: string[]
}

export class NewEmployee{
    organisationId: string
    userId: string
    role: Role
}

export class ChangeRoleModel{
    employeeId: string
    roleName: string
}
export class AssignParticipantsModel{
    employeeId: string
    participants: string[]
}