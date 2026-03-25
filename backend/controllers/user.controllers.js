import User from "../models/user.model.js";
import {logger} from "../config/logger.js";
import admin from "../config/firebase.js";
import {generateToken} from "../utils/jwt.js";

export const login = async(req, res) => {
    try {
        const{token : idToken} = req.body;
        if(!idToken){
            return res.status(400).json({
                message: "No token "
            })
        }
        const decoded = await admin.auth().verifyIdToken(idToken);
        const {uid, name, email} = decoded;
        // Search by email instead of firebaseId, since the Firebase project changed!
        let user = await User.findOne({ email: email });
        
        if (!user) {
            user = new User({
                firebaseId: uid,
                name: name,
                email: email
            });
        } else {
            // Update the user's firebase ID in case it changed (e.g. new Firebase project)
            if (user.firebaseId !== uid) {
                user.firebaseId = uid;
            }
        }
        await user.save();
        if(user){
            const token = generateToken({userId: user._id});

            return res.status(200).json({
                user:{
                    id:user._id,
                    firebaseId: user.uid,
                    name:user.name,
                    email:user.email
                },
                data: {
                    token
                }
            })

        }

        logger.info("User authenticated");

    } catch (error) {
        logger.error(error);
        console.log(error)
        
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({
                message: "User not found"
            })
        }
        logger.info("Got user");
        return res.status(200).json({
            user: {
                id: userId,
                firebaseId: req.user.firebaseId,
                name: req.user.name,
                email: req.user.email

            }
        })
    } catch (error) {
        logger.error(error);
        console.log(error)
    }
}