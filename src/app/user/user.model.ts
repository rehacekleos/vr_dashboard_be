/**
 * User
 */
export class User {
    /** ID */
    id: string;
    /** Email */
    email: string;
    /** Name */
    name: string;
    /** Surname */
    surname: string;
    /** Password */
    password: string;
    /** Is super admin? */
    superAdmin?: boolean;
    /** Is developer? */
    developer?: boolean;
}