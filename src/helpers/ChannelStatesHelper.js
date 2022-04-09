export class ChannelStatesHelper {
    constructor() {
    }

    static joinedChannel(oldState, newState) {
        if (oldState.channelId === null && newState.channelId !== null) { // joined channelId
            console.log(oldState.member.displayName)
            return true;
        }
        return false;
    }

    static leftChannel(oldState, newState) {
        if (oldState.channelId !== null && newState.channelId === null) {
            return true;
        }
        return false;
    }

    static movedChannel(oldState, newState) //did the user move voice channels
    {
        if (oldState.channelId !== null && newState.channelId !== null && oldState.channelId != newState.channelId) {
            return true;
        }
        return false;
    }

    static toAFK(oldState, newState)//did user join the AFK channel
    {
        if (newState.channelId === newState.guild.afkChannel) {
            return true;
        }
        return false;
    }

    static fromAFK(oldState, newState) //did user leave the AFK channel
    {
        if (oldState.channelId === oldState.guild.afkChannel) {
            return true;
        }
        return false;
    }
}