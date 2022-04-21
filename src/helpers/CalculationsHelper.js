export class CalculationsHelper {

    static milliSecondsToSeconds(timeStamp){
        return (timeStamp/1000).toFixed(0)
    }
    static secondsToMinutes(seconds){
        return Math.floor(seconds/60)
    }
    static secondsToHours(seconds) {
        return Math.floor(seconds/3600)
    }
    static secondsToDays(seconds) {
        return Math.floor(seconds/86400)
    }
    static minutesToHours(minutes){
        return Math.floor(minutes/60)
    }

}