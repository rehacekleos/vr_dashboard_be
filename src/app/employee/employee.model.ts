import { Role } from "../../models/role.model";
import { User } from "../user/user.model";

/**
 * Employee
 */
export class Employee {
    /** ID */
    id: string
    /** Organisation ID */
    organisationId: string
    /** User ID */
    userId: string
    /** Role */
    role: Role
    /** User */
    user?: User

    /** Array of Participant IDs */
    participantIds: string[]
}

/**
 * New Employee
 */
export class NewEmployee{
    /** Organisation ID */
    organisationId: string
    /** User ID */
    userId: string
    /** Role */
    role: Role
}

/**
 * Change Role
 */
export class ChangeRoleModel{
    /** Employee ID */
    employeeId: string
    /**
     * New role name
     * @see {@link RoleNames}
     */
    roleName: string
}

/**
 * Assign Participants to Employee
 */
export class AssignParticipantsModel{
    employeeId: string
    participants: string[]
}