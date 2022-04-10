import dotenv from 'dotenv'
import { Client, Intents} from 'discord.js'
import {ChannelStatesHelper} from "./helpers/ChannelStatesHelper.js";

dotenv.config()

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES]})
let users = []
client.once('ready', ()=>{
    console.log('ready!')
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.log(interaction.client.guilds.cache.get(process.env.SERVER_ID).commands)
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
client.on('voiceStateUpdate',(oldState, newState) =>{

    if (ChannelStatesHelper.joinedServer(oldState, newState)  && !ChannelStatesHelper.toAFK(oldState, newState)){
        console.log(`${newState.member.displayName} joined Server at channel ${newState.channel.name} record time start`)
        onlineTimeStamp = Date.now()
    }
    else if (ChannelStatesHelper.leftServer(oldState, newState) || ChannelStatesHelper.leftServer(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState) ){
        console.log(`${oldState.member.displayName} leaved Server record time stop`)
        if(!fromAFK)
            onlineTime += Date.now() - onlineTimeStamp
        console.log(`time spend on server: ${onlineTime/1000} seconds`)
    }
    else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.toAFK(oldState, newState)){
        console.log(`${newState.member.displayName} entered AFK channel ${newState.channel.name} record time stop`)
        fromAFK = true
        onlineTime += Date.now() - onlineTimeStamp
    }
    else if (ChannelStatesHelper.movedChannel(oldState, newState) && ChannelStatesHelper.fromAFK(oldState, newState)){
        console.log(`${newState.member.displayName} leaved AFK channel ${newState.channel.name} record time start`)
        fromAFK = false
        onlineTimeStamp = Date.now()
    }
})

client.login(process.env.DISCORD_TOKEN).then(()=>{
    console.log('logged in!')
})