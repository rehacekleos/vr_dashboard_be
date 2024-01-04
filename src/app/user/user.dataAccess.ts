import { BaseDataAccess } from "../../shared/da/Base.dataAccess";
import { CollectionName } from "../../shared/repositories/mongoDb/collectionName.enum";
import { User } from "./user.model";
import { RegisterUser } from "../auth/auth.model";
import { PasswordUtil } from "../../shared/utils/password.util";
import { v4 as uuid } from 'uuid';

/**
 * Singleton DataAccess for entity User
 */
export class UserDataAccess extends BaseDataAccess {

    /** Instance */
    private static instance: UserDataAccess;

    /**
     *
     */
    constructor() {
        super(CollectionName.USERS);
    }

    public static getInstance() {
        if (!UserDataAccess.instance) {
            UserDataAccess.instance = new UserDataAccess();
        }
        return UserDataAccess.instance;
    }

    public async getUserById(id: string) {
        return await this.db.collection(this.collection).findOne<User>({id: id});
    }

    public async getUserByEmail(email: string) {
        return await this.db.collection(this.collection).findOne<User>({email: email.trim().toLowerCase()});
    }

    public async getAllUsers() {
        return await this.db.collection(this.collection).find<User>({}).toArray();
    }

    public async createUser(register: RegisterUser): Promise<User> {
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

    public async deleteUser(id: string){
        const res = await this.db.collection(this.collection).deleteOne({id: id});
        if (res.acknowledged === false){
            throw new Error("Cannot delete user from DB.")
        }
    }
}