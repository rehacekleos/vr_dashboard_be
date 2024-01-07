/**
 * Organisation
 */
export class Organisation {
    /** ID */
    id: string;
    /** Code */
    code: string;
    /** Name */
    name: string;
    /** Array of Application Ids */
    applicationIds: string[];
}

/**
 * New Organisation
 */
export class NewOrganisation {
    /** Name */
    name: string;
}