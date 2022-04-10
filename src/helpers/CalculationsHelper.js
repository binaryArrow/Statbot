export class CalculationsHelper {

    static milliSecondsToSeconds(timeStamp){
        return (timeStamp/1000).toFixed(0)
    }
    static secondsToMinutes(seconds){
        return (seconds/60).toFixed(0)
    }
    static minutesToHours(minutes){
        return (minutes/60).toFixed(0)
    }

}