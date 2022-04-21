import {CalculationsHelper} from "./CalculationsHelper.js";

export class StringBuilder{

    static buildForUserTimeList(userData){
        console.log(userData)
        let buildedString = ''
        userData.forEach(user =>{
            let seconds = CalculationsHelper.milliSecondsToSeconds(user.online_time)
            const days = CalculationsHelper.secondsToDays(seconds)
            seconds %= 86400
            const hours = CalculationsHelper.secondsToHours(seconds)
            seconds %= 3600
            const minutes = CalculationsHelper.secondsToMinutes(seconds)
            seconds %= 60
            buildedString = buildedString +
                `\n${user.username}\nTime-wasted: ${days}d ${hours}h ${minutes}m ${seconds}s\n`
        })
        return buildedString
    }
}