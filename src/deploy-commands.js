import {SlashCommandBuilder} from '@discordjs/builders'
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
import {Logger} from "./logger/Logger.js"
import dotenv from 'dotenv'

dotenv.config()

const logger = new Logger().logger
const CLIENT_ID = process.env.CLIENT_ID
const TOKEN = process.env.DISCORD_TOKEN
const GUILD_ID = process.env.SERVER_ID
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('usertimelist').setDescription('Prints list with User times')
]
    .map(command => command.toJSON());

const rest = new REST({version: '10'}).setToken(TOKEN);
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then((command) => {
        command.map(it => {
            return {name: it.name, id: it.id}}
        ).forEach(returnedCommand => logger.info(`new command added with NAME: '${returnedCommand.name}' and ID: ${returnedCommand.id}`))
    })
    .catch(console.error);


// rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, commandID))
//     .then((res) => {
//     console.log(`deleted ${res.name}` )
// })
