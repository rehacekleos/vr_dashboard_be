import bcrypt from 'bcrypt';

export class PasswordUtil{

    public static async hashPassword(password): Promise<string>{
       return await bcrypt.hash(password, 10);
    }

    public static async comparePassword(password: string, compareTo: string): Promise<boolean>{
        return await bcrypt.compare(password, compareTo);
    }

}