import {Sequelize, where} from "sequelize";
import {Users} from "./models/Users.js";
import {Logger} from "../logger/Logger.js";

export class Connector {
    logger = new Logger().logger
    sequelize
    tables = []

    constructor() {
        this.sequelize = new Sequelize('stats_base', 'user', 'root', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: 'src/database/stats_base.sqlite'
        })
        this.tables.push(new Users(this.sequelize).users)
    }

    // always creates first timestamp on server Join
    async createUserIfNotExists(userName, userId, afkState) {
        try {
            const table = this.tables.find(table => table.name === 'users')
            table.findOrCreate({
                where: {userId: userId},
                defaults: {
                    userId: userId,
                    username: userName,
                    from_afk: afkState
                }
            }).then(([user, isNew]) => {
                if (!afkState)
                    this.setOnlineTimestampOfUser(userId, Date.now())
                if (isNew)
                    this.logger.info(`${user.username} was created`)
                else if (!isNew) {
                    table.update({from_afk: afkState}, {where: {userId: userId}})
                }
                this.logger.info(`${user.username} already exists`)
            })
        } catch (e) {
            console.log(e)
        }
    }

    async updateUserOnlineTime(userId) {
        try {
            const table = this.tables.find(table => table.name === 'users')
            let oldOnlineTime
            let onlineTimeStamp
            table.findOne({where: {userId: userId}}).then((record) => {
                oldOnlineTime = record.online_time
                onlineTimeStamp = record.online_timestamp
                if (oldOnlineTime === null)
                    oldOnlineTime = 0
                oldOnlineTime += Date.now() - onlineTimeStamp
                table.update({online_time: oldOnlineTime}, {
                    where: {userId: userId}
                }).then(user => {
                    this.logger.info(`${user.username} online time changed`)
                })

            })
        } catch (e) {
            this.logger.error(e)
        }
    }
    async getUser(userId){
        const table = this.tables.find(table => table.name === 'users')
        try {
            return await table.findOne({where: {userId: userId}})
        } catch (e) {
            this.logger.error(e)
        }
    }

    async getAllUserStats(){
        const table = this.tables.find(table => table.name === 'users')
        return await table.findAll()
    }

    async setUserFromAfkProperty(userId, value){
        const table = this.tables.find(table => table.name === 'users')
        const exists = await table.findOne({where: {userId: userId}})
        if(exists)
            return table.update({from_afk: value}, {where: {userId: userId}})
        return null
    }

    async setOnlineTimestampOfUser(userId, onlineTimestamp) {
        const table = this.tables.find(table => table.name === 'users')
        const exists = await table.findOne({where: {userId: userId}})
        if(exists){
            return table.update({online_timestamp: onlineTimestamp}, {where: {userId: userId}})
        }
    }
}