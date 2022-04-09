import dotenv from 'dotenv'
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "path";
dotenv.config()

dotenv.config()
export class Logger {
    logger
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(this.__filename);
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.File({ filename: path.join(`${this.__dirname}/logs`, 'error.log'), level: 'error', }),
                new winston.transports.File({ filename: path.join(`${this.__dirname}/logs`, 'combined.log') }),
            ]
        })
        if(process.env.NODE_ENV !== 'PROD')
            this.startProductionConfig(this.logger)
    }

    startProductionConfig(logger){
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
}