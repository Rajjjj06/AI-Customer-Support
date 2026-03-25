import winston from "winston";
import  { existsSync, mkdir } from "fs";

const logsDir = "logs"

if(!existsSync.logsDir){
    mkdir.logsDir
};

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: `${logsDir}/error.log`, level: "error" }),
        new winston.transports.File({ filename: `${logsDir}/combined.log` }),
    ],
});

export const morganStream = {
    write: (message) => {
        logger.info(message.trim());
    }
};