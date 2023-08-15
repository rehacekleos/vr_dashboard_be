import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { AuthController } from "../auth/auth.controller";
import { User } from "./user.model";
import { RegisterUser } from "../auth/auth.model";
import { PasswordUtil } from "../../shared/utils/password.util";
import { v4 as uuid } from 'uuid';

export class UserDataAccess extends BaseDataAccess {

    private static instance: UserDataAccess;

    constructor() {
        super(CollectionName.USERS);
    }

    public static getInstance() {
        if (!UserDataAccess.instance) {
            UserDataAccess.instance = new UserDataAccess();
        }
        return UserDataAccess.instance;
    }


    async getUserByEmail(email: string) {
        return await this.db.collection(this.collection).findOne<User>({email: email.trim().toLowerCase()});
    }

    async createUser(register: RegisterUser): Promise<User> {
        const newUser: User = {
            id: uuid(),
            email: register.email.trim().toLowerCase(),
            name: register.name.trim(),
            surname: register.surname.trim(),
            password: await PasswordUtil.hashPassword(register.password.trim())
        }
        const res = await this.db.collection(this.collection).insertOne(newUser)
        if (res.acknowledged === false){
            throw new Error("Cannot save user into DB.")
        }

        return newUser;
    }
}