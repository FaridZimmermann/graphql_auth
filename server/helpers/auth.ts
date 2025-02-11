import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secretKey: string) => {
    //Verify the token and return the decoded payload if valid, otherwise return null
    //args: token: string, secretKey: string
    try {
        if (!token) return null;
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        return decoded;
    } catch {
        return null;
    }

}