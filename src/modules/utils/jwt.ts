import * as jwt from 'jsonwebtoken';

export default {
    createToken: function (data: any, time: string) {
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
    },
    verifyToken: function (token: string) {
        let result;
        try {
            jwt.verify(token, String(process.env.JWT_KEY), function (err, decoded) {
                if (err) {
                    console.log("err", err)
                    result = false
                } else {
                    result = decoded
                }
            });
            return result
        } catch (err) {
            return false
        }
    }
}