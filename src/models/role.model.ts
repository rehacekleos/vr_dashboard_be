export class Role {
    name: RoleNames
}

export enum RoleNames {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
}

export const AdminRole: Role = {
    name: RoleNames.ADMIN
}