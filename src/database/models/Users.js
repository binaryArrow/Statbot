import {Sequelize} from "sequelize";

export class Users{
    users
    constructor(sequelize) {
        this.users = sequelize.define('users', {
            userId: {
                type: Sequelize.STRING,
                unique: true
            },
            username: {
                type: Sequelize.STRING,
                unique: false
            },
            from_afk: {
                type: Sequelize.BOOLEAN,
                unique: false,
                defaultValue: false
            },
            online_time: {
                type: Sequelize.NUMBER,
                unique: false,
                defaultValue: 0
            },
            online_timestamp: {
                type: Sequelize.NUMBER,
                unique: false,
                defaultValue: 0
            }
        })
    }
}