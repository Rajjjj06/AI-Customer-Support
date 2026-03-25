import multer from "multer";
import multerS3 from "multer-s3"
import { s3client } from "../config/s3.js";

export const uploadFile = multer({
    storage: multerS3({
        s3: s3client,
        bucket: process.env.BUCKET_NAME,
        contentDisposition: "inline",
        contentType: multerS3.AUTO_CONTENT_TYPE,
       
        key: (req, file, cb) => {
            
        const uniqueName = Date.now()+ "-"+file.originalname
        cb(null, uniqueName)
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
    fileFilter: (req, file,cb) => {
        if(file.mimetype === "application/pdf"){
            cb(null, true)
        }
        else{
            cb(new Error("Not of required file type"))
        }

    }
})