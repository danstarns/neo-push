import jwt from "jsonwebtoken";
import * as config from "../../config";

function decodeJWT(token: string): Promise<{ sub: string; }> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }

            const { sub } = decoded;

            return resolve({ sub });
        });
    });
}

export default decodeJWT;