# Statbot
the Discord statbot tracks time of every user spend in voice-channels(not in afk channels) in a Sqlite Database.
 
1. make sure to add a .env File in Root directory with following Content:
```
# DEV for development PROD for production
NODE_ENV='DEV'
DISCORD_TOKEN="place-your-discord-token-here"
SERVER_ID="place-your-server-id-here"
CLIENT_ID="place-your-client-id-here" 
```
2. after setting env variables you can start the application via `node main.js` or run the start script form the `package.json`
