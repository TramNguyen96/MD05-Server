import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';


@Injectable()
export class JwtService {
    createToken(data: any, time: string) {
        try {
            return jwt.sign(
                {
                    ...data
                }
                , String(process.env.JWT_KEY)
                , { expiresIn: `${time}` });
        } catch (err) {
            console.log("err", err)
            return false
        }
    }
    
    verifyToken(token: string) {
        let result;
        try {
            jwt.verify(token, String(process.env.JWT_KEY), function(err, decoded) {
                if(err) {
                    result = false
                }else {
                    result = decoded
                }
            });
            return result
        }catch(err) {
            return false
        }
    }
}