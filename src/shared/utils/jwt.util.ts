import jwt from 'jsonwebtoken';
import { ConfigFactory } from "../../configs/factories/config.factory";
import { HttpException } from "../exceptions/HttpException";

export class JwtUtil{

    private static instance: JwtUtil;
    private readonly secret: string;
    private readonly issuer: string;

    constructor() {
        this.secret = ConfigFactory.getConfig().jwtSecret;
        this.issuer = ConfigFactory.getConfig().jwtIssuer;
    }

    public static getInstance(){
        if(!JwtUtil.instance){
            JwtUtil.instance = new JwtUtil();
        }
        return JwtUtil.instance;
    }

    /**
     *
     * @param payload
     * @param duration expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js) . Eg: 60, “2 days”, “10h”, “7d”
     */
    public createToken(payload: object, duration = '12h'){
        const conf: jwt.SignOptions = {
            issuer: this.issuer
        }

        if (duration){
            conf.expiresIn = duration;
        }

        return jwt.sign(payload, this.secret, conf)
    }


    public verifyToken<T>(token: string): T{
        const conf: jwt.VerifyOptions = {
            issuer: this.issuer
        }
        try {
            return jwt.verify(token, this.secret, conf) as T;
        } catch (e) {
            if (e.message === "jwt expired"){
                throw new HttpException(403, "JWT token expired");
            } else {
                throw e;
            }
        }
    }

}