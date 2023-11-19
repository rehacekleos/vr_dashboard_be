import bcrypt from 'bcrypt';

/**
 * Password utils
 */
export class PasswordUtil{

    /**
     * Hash password with bcrypt.
     * @param password
     */
    public static async hashPassword(password: string): Promise<string>{
       return await bcrypt.hash(password, 10);
    }

    /**
     * Compare string password with hashed password
     * @param password
     * @param compareTo
     */
    public static async comparePassword(password: string, compareTo: string): Promise<boolean>{
        return await bcrypt.compare(password, compareTo);
    }

}