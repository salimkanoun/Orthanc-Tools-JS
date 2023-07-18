import React from "react"
import Calendar from "react-calendar"

export default ({ value, onChange, maxDate = new Date(), required = false }) => {

    /*
    const handleDateChange = (date) => {
        let utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
        onChange(utcDate)
    }
    */

    return (
        <div>
            <Calendar
                required={required}
                calendarType="ISO 8601"
                onChange={onChange}
                value={value}
                maxDate={maxDate}
            />
        </div>
    )

}