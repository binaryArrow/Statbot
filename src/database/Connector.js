import {Sequelize} from "sequelize";
import {Users} from "./models/Users.js";
import {Logger} from "../logger/Logger.js";

export class Connector {
    logger = new Logger().logger
    sequelize
    tables = []
    constructor() {
        this.sequelize = new Sequelize('stats_base', 'user','root', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: 'src/database/stats_base.sqlite'
        })
        this.tables.push(new Users(this.sequelize).users)
    }

    async createNewUser(userName, userId){
        try{
            this.tables.find(table => table.name === 'users').findOrCreate({
                where: {userId: userId},
                defaults: {
                    userId: userId,
                    username: userName
                }
            }).then(([user, isNew])=> {
                if(isNew)
                    this.logger.info(`${user.username} was created`)
                else
                    this.logger.info(`${user.username} already exists`)
            })
        } catch (e){
            console.log(e)
        }
    }
}