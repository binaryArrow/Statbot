import {CalculationsHelper} from "./CalculationsHelper.js";

export class StringBuilder{

    static buildForUserTimeList(userData){
        console.log(userData)
        let buildedString = ''
        userData.forEach(user =>{
            const seconds = CalculationsHelper.milliSecondsToSeconds(user.online_time)
            const minutes = CalculationsHelper.secondsToMinutes(seconds)
            const hours = CalculationsHelper.minutesToHours(minutes)
            buildedString = buildedString +
                `\n${user.username}\nTime-wasted: ${hours}h ${minutes}m ${seconds}s\n`
        })
        return buildedString
    }
}