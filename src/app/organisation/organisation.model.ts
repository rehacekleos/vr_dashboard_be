import { User } from "../user/user.model";

export class Organisation {
    id: string;
    code: string;
    name: string;
    applicationIds: string[];
}

export class NewOrganisation {
    name: string;
}