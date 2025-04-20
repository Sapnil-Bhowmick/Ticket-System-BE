
const getTimeInMinutes = (missedChatDuration) => {
    const {hours , minutes , seconds} = missedChatDuration
    const timeinMinutes =  Math.round(hours*60 + minutes + seconds/60)
    
    return timeinMinutes === 0 ? 60 : timeinMinutes
}


module.exports = {
    getTimeInMinutes
}