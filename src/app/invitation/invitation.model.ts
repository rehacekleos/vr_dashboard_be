import { RoleNames } from "../../models/role.model";

/**
 * Invitation
 */
export class Invitation{
    /** ID */
    id: string;
    /** Organisation ID */
    organisationId: string;
    /** Email */
    email: string;
    /** Role */
    role: RoleNames;
    /** Code */
    code: string;
    /** Timestamp */
    time: string;
}

/**
 * Accept invitation
 */
export class AcceptInvitation{
    /** Invitation code*/
    code: string;
}

/**
 * New invitation
 */
export class NewInvitation{
    /** User email*/
    email: string;
    /**
     * Role
     * @see {@link RoleNames}
     */
    role: string;
}