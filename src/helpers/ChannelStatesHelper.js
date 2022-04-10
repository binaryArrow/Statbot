export class ChannelStatesHelper {

    static joinedServer(oldState, newState) {
        return oldState.channelId === null && newState.channelId !== null;

    }

    static leftServer(oldState, newState) {
        return oldState.channelId !== null && newState.channelId === null;

    }

    static movedChannel(oldState, newState) //did the user move voice channels
    {
        return oldState.channelId !== null && newState.channelId !== null && oldState.channelId !== newState.channelId;
    }

    static toAFK(oldState, newState)//did user join the AFK channel
    {
        return newState.channelId === newState.guild.afkChannelId;

    }

    static fromAFK(oldState, newState) //did user leave the AFK channel
    {
        return oldState.channelId === oldState.guild.afkChannelId;

    }
}