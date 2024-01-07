import { User } from "../user/user.model";

/**
 * Login model
 */
export class LoginUser {
    /** Email */
    email: string;
    /** Password */
    password: string;
}

/**
 * Register model
 */
export class RegisterUser extends User{
    /** Password confirmation */
    rePassword: string;
}

/**
 * Authentication response
 */
export class AuthResponse {
    /** JWT token */
    token: string;
    /** User */
    user: User;
}