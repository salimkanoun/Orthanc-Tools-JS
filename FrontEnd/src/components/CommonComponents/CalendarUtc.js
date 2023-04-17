import React from "react"
import Calendar from "react-calendar"

export default ({ value, onChange, maxDate, required = false }) => {

    const handleDateChange = (date) => {
        let utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
        onChange(utcDate)
    }

    return (
        <div>
            <Calendar
                required={required}
                calendarType="ISO 8601"
                onChange={handleDateChange}
                value={value}
                maxDate={maxDate}
            />
        </div>
    )

}