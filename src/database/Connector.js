import {Sequelize, where} from "sequelize";
import {Users} from "./models/Users.js";
import {Logger} from "../logger/Logger.js";
import {CalculationsHelper} from "../helpers/CalculationsHelper.js";

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
                    this.setOnlineTimestampOfUser(userId, userName, Date.now())
                if (isNew)
                    this.logger.info(`${user.username} was created`)
                else {
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
            let fromAfk
            table.findOne({where: {userId: userId}}).then((record) => {
                oldOnlineTime = record.online_time
                onlineTimeStamp = record.online_timestamp
                fromAfk = record.from_afk
                if (oldOnlineTime === null)
                    oldOnlineTime = 0
                if (!fromAfk)
                    oldOnlineTime += Date.now() - onlineTimeStamp
                table.update({online_time: oldOnlineTime, from_afk: false}, {
                    where: {userId: userId}
                }).then(user => {
                    this.logger.info(`${user.username} online time changed`)
                })

            })
        } catch (e) {
            this.logger.error(e)
        }
    }

    async setOnlineTimestampOfUser(userId, userName, onlineTimestamp) {
        try {
            this.tables.find(table => table.name === 'users').update({online_timestamp: onlineTimestamp}, {
                where: {userId: userId}
            }).then(() => {
                this.logger.info(`${userName} online timestamp changed`)
            })
        } catch (e) {
            this.logger.error(e)
        }
    }
}