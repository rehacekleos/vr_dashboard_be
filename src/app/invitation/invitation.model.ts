import { Role } from "../../models/role.model";

export class Invitation{
    id: string;
    organisationId: string;
    userId: string;
    role: Role;
    code: string;
    time: string;
}