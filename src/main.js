import dotenv from 'dotenv'
import {Client, Intents} from 'discord.js'
import {ChannelStatesHelper} from "./helpers/ChannelStatesHelper.js";
import {Connector} from "./database/Connector.js";
import {Logger} from "./logger/Logger.js";
import {StringBuilder} from "./helpers/StringBuilder.js";

dotenv.config()

const logger = new Logger().logger
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES]})
let database = new Connector()
client.once('ready', () => {
    database.tables.forEach(table => table.sync())
    console.log('ready!')
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // beneath code sample shows eg. command id's
    // console.log(interaction.client.guilds.cache.get(process.env.SERVER_ID).commands)
    const {commandName} = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong');
    } else if (commandName === 'server') {
        await interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    } else if (commandName === 'usertimelist'){
        const list = StringBuilder.buildForUserTimeList(await database.getAllUserStats())
        await interaction.reply(`--------USER-STUNDEN-LISTE--------- \n${list}`)
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    if (ChannelStatesHelper.joinedServer(oldState, newState) && !ChannelStatesHelper.toAFK(oldState, newState)) {
        logger.info(`${newState.member.displayName} joined Server at channel ${newState.channel.name}`)
        await database.createUserIfNotExists(newState.member.displayName, newState.member.id, false)
    } else if (ChannelStatesHelper.joinedServer(oldState, newState) && ChannelStatesHelper.toAFK(oldState, newState)) {
        await database.createUserIfNotExists(newState.member.displayName, newState.member.id, true)
    } else if (ChannelStatesHelper.leftServer(oldState, newState) || ChannelStatesHelper.leftServer(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState)) {
        const userState = await database.getUser(oldState.member.id)
        if (userState.from_afk)
            await database.setUserFromAfkProperty(oldState.member.id, false)
        else
            await database.updateUserOnlineTime(oldState.member.id, oldState.member.displayName)
    } else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.toAFK(oldState, newState)) {
        logger.info(`${newState.member.displayName} entered AFK channel`)
        const userState = await database.getUser(oldState.member.id)
        if (!userState.from_afk)
            await database.updateUserOnlineTime(newState.member.id, oldState.member.displayName)
        await database.setUserFromAfkProperty(newState.member.id, true)
    } else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState)) {
        logger.info(`${newState.member.displayName} leaved AFK channel`)
        await database.setUserFromAfkProperty(newState.member.id, false)
        await database.setOnlineTimestampOfUser(newState.member.id, Date.now())
    }
})

client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('logged in!')
})