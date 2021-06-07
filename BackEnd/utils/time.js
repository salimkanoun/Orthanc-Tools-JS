const time = {
    isTimeInbetween(xHours, xMinutes, startHours, startMinutes, endHours, endMinutes){
        return time.compareTime(xHours, xMinutes, startHours, startMinutes)>0&&time.compareTime(xHours, xMinutes, endHours, endMinutes)<0 ||
        time.compareTime(startHours, startMinutes, endHours, endMinutes)>0 && (time.compareTime(xHours, xMinutes, startHours, startMinutes)>0 || time.compareTime(xHours, xMinutes, endHours, endMinutes)<0)
    },
    compareTime(xHours,xMinutes,yHours,yMinutes){
        if(xHours>yHours||xHours===yHours&&xMinutes>yMinutes){
            return 1
        }else if(xHours===yHours&&xMinutes===yMinutes){
            return 0
        }else{
            return -1
        } 
    }
}

module.exports = time