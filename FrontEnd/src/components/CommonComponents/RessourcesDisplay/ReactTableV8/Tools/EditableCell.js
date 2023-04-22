import React, { useEffect, useState } from "react"
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"
import Select from "react-select"

import CalendarUtc from "../../../CalendarUtc"

export default ({ getValue, row: { index, id: rowId }, column: { columnDef: { id: columnId, style, editionProperties: { type, minLength, maxLength, min, max, placeholder, options, isClearable = true, disabled } = {}, isEditable = false } }, table }) => {

    if (!isEditable) return getValue()

    // Update the state of the cell normally
    let initialValue = getValue()

    const [value, setValue] = useState(initialValue)

    const onChange = e => {
        let value = e.target.value // Treat empty string as null value
        setValue(value)
    }
    // Update the external data when the input is blurred
    const onBlur = () => {
        table.options.meta?.updateData(rowId, columnId, value)
    }

    // If the initialValue is changed external, sync it up with state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    if (type == 'SELECT') {
        return (
            <div style={style} >
                <Select
                    name={columnId}
                    isClearable={isClearable}
                    menuPosition='fixed'
                    menuPlacement='top'
                    placeholder='Select...'
                    value={options.filter((option) => option.value === value)}
                    options={options}
                    onChange={(option, actionMeta) => {
                        table.options.meta?.updateData(rowId, columnId, option?.value)
                    }}
                />
            </div>
        )
    }

    if (type == 'CALENDAR') {

        const [visible, setVisible] = useState(false)
        let calendarDate = value ? new Date(value) : null
        const myButton = <Button variant='light' style={style}>{calendarDate ? calendarDate.toLocaleDateString("en-US") : 'N/A'}</Button>

        const myCalendar = (
            <Popover>
                <CalendarUtc
                    onChange={(date) => {
                        setVisible(false)
                        if (date.getTime() === calendarDate?.getTime()) date = null
                        table.options.meta?.updateData(rowId, columnId, date?.getTime())
                    }}
                    required
                    maxDate={new Date()}
                    value={calendarDate}
                />
            </Popover>
        )
        return (
            <OverlayTrigger
                trigger='click'
                placement='bottom-start'
                show={visible}
                onToggle={(show) => { setVisible(show) }}
                overlay={
                    <Tooltip>
                        {myCalendar}
                    </Tooltip>
                }
            >
                {myButton}
            </OverlayTrigger>
        )
    }

    if (type === 'CHECKBOX') {
        return (
            <input
                type='CHECKBOX'
                defaultChecked={value}
                disabled={disabled}
                onChange={(event) => table.options.meta?.updateData(rowId, columnId, event.target.checked)}
            />
        )
    }

    return (<input
        className='editable-cell'
        style={style}
        disabled={disabled}
        type={type}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={e => { e.stopPropagation() }}
        onBlur={onBlur}
    />)
}