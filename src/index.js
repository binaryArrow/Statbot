import dotenv from 'dotenv'
import { Client, Intents} from 'discord.js'

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

client.on('voiceStateUpdate',(oldState, newState) =>{
    if(oldState.channelId === null && newState.channelId !== null){
        console.log(oldState.member.displayName)
    }
})

client.login(process.env.DISCORD_TOKEN).then(()=>{
    console.log('logged in!')
})