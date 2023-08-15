import { Role } from "../../models/role.model";

export class Employee {
    id: string
    organisationId: string
    userId: string
    role: Role

    participantIds: string[]
}