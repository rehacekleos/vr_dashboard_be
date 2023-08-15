import { User } from "../user/user.model";

export class LoginUser {
    email: string;
    password: string;
}

export class RegisterUser extends User{
    rePassword: string;
}

export class AuthResponse {
    token: string;
    user: User;
}