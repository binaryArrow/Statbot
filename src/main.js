import dotenv from 'dotenv'
import { Client, Intents} from 'discord.js'
import {ChannelStatesHelper} from "./helpers/ChannelStatesHelper.js";
import {Connector} from "./database/Connector.js";
import {Logger} from "./logger/Logger.js";

dotenv.config()

const logger = new Logger().logger
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES]})
let database = new Connector()
client.once('ready', ()=>{
    database.tables.forEach(table => table.sync())
    console.log('ready!')
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // beneath code sample shows eg. command id's
    // console.log(interaction.client.guilds.cache.get(process.env.SERVER_ID).commands)
    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong');
    } else if (commandName === 'server') {
        await interaction.reply(
            `Server name: ${interaction.guild.name}\nToal members: ${interaction.guild.memberCount}`
        );
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});

let onlineTimeStamp
let onlineTime = 0
let fromAFK = false
client.on('voiceStateUpdate',async (oldState, newState) =>{

    if (ChannelStatesHelper.joinedServer(oldState, newState)  && !ChannelStatesHelper.toAFK(oldState, newState)){
        logger.info(`${newState.member.displayName} joined Server at channel ${newState.channel.name} record time start`)
        await database.createUserIfNotExists(newState.member.displayName, newState.member.id)
    }
    else if (ChannelStatesHelper.leftServer(oldState, newState) || ChannelStatesHelper.leftServer(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState) ){
        logger.info(`${oldState.member.displayName} leaved Server record time stop`)
        if(!fromAFK){
            await database.updateUserOnlineTime(oldState.member.id)
        }
        logger.info(`time spend on server: ${onlineTime/1000} seconds`)
        fromAFK = false
    }
    else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.toAFK(oldState, newState)){
        logger.info(`${newState.member.displayName} entered AFK channel ${newState.channel.name} record time stop`)
        fromAFK = true
        onlineTime += Date.now() - onlineTimeStamp
    }
    else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState)){
        logger.info(`${newState.member.displayName} leaved AFK channel ${newState.channel.name} record time start`)
        fromAFK = false
        onlineTimeStamp = Date.now()
    }
})

client.login(process.env.DISCORD_TOKEN).then(()=>{
    console.log('logged in!')
})