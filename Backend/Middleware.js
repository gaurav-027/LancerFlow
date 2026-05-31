import jwt from "jsonwebtoken";
import httpStatus from "http-status";

export async function authuser(req,res,next){
    const token = req.cookies?.token;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // return req.user;
        next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({message : "Invalid Token"});
    }
}