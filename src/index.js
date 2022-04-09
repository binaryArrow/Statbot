require('dotenv').config()
const { Client, Intents} = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS]})

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
        await interaction.reply('Server info.');
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});
client.login(process.env.DISCORD_TOKEN).then(()=>{
    console.log('logged in!')
})