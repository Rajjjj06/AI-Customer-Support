import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js"
import { logger } from "../config/logger.js";

export const authMiddleware = async (req, res, next) => {
    try{
            const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(400).json({
            message:"No header found"
        })

    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);

    const { userId } = decodedToken;

    const user = await User.findById(userId);

    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }

    req.user = user;

    next();
    }catch(error){
        logger.error(error);
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }


   

    

}