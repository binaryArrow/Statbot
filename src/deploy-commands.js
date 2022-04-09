const {SlashCommandBuilder} = require('@discordjs/builders')
const {REST} = require('@discordjs/rest')
const {Routes} = require('discord-api-types/v9')
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const TOKEN = process.env.DISCORD_TOKEN
const GUILD_ID = process.env.SERVER_ID

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
    .map(command => command.toJSON());

const rest = new REST({version: '10'}).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

// rest.get(Routes.guildChannels(GUILD_ID)).then((res)=>console.log(res)).catch(console.error)