import { BaseService } from "../../shared/services/Base.service";
import { UserDataAccess } from "../user/user.dataAccess";
import { AuthResponse, LoginUser, RegisterUser } from "./auth.model";
import { isEmpty } from "../../shared/utils/common.util";
import { HttpException } from "../../shared/exceptions/HttpException";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { PasswordUtil } from "../../shared/utils/password.util";

export class AuthService extends BaseService{

    private jwtUtil = JwtUtil.getInstance();

    constructor(private userDa: UserDataAccess) {
        super();
    }

    public async login(login: LoginUser): Promise<AuthResponse> {
        if (isEmpty(login.email) || isEmpty(login.password)){
            throw new HttpException(400, "Wrong login model.")
        }
        const user = await this.userDa.getUserByEmail(login.email);
        if (isEmpty(user)){
            throw new HttpException(400, "Wrong email.");
        }
        if (!await PasswordUtil.comparePassword(login.password, user.password)){
            throw new HttpException(400, "Wrong password.");
        }

        const token = this.jwtUtil.createToken(user);

        return {
            token: token,
            user: user
        };
    }

    public async register(register: RegisterUser): Promise<AuthResponse> {



        const user = await this.userDa.createUser(register);
        const token = this.jwtUtil.createToken(user);

        return {
            token: token,
            user: user
        };
    }
}