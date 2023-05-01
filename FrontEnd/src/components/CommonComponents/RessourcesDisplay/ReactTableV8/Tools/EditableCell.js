import React, { useEffect, useState } from "react"
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap"
import Select from "react-select"

import CalendarUtc from "../../../CalendarUtc"
import moment from "moment"

export default ({ getValue, row: { index, id: idRow }, column: { columnDef: { id, accessorKey, header, style, editionProperties: { type, minLength, maxLength, min, max, placeholder, options, isClearable = true, disabled } = {}, isEditable = false } }, table }) => {

    const columnId = id ?? accessorKey ?? header
    const rowId = idRow ?? index

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

        const myButton = <Button variant='light' style={style}>{value ? moment(value).format('YYYYMMDD') : "N/A"}</Button>

        const myCalendar = (
            <Popover>
                <Popover.Header>
                    Choose Date
                </Popover.Header>
                <Popover.Body>
                    <CalendarUtc
                        onChange={(date) => {
                            setVisible(false)
                            console.log(date, value)
                            if (date.getTime() === value?.getTime()) {
                                date = null
                            } else {
                                date = moment(date).format('YYYYMMDD')
                            }
                            table.options.meta?.updateData(rowId, columnId, date)
                        }}
                        required
                        maxDate={new Date()}
                        value={value}
                    />
                </Popover.Body>

            </Popover>
        )
        return (
            <OverlayTrigger
                trigger='click'
                placement='bottom-start'
                show={visible}
                onToggle={(show) => { setVisible(show) }}
                overlay={
                    <div>
                        {myCalendar}
                    </div>
                }
            >
                {myButton}
            </OverlayTrigger>
        )
    }

    if (type === 'CHECKBOX') {
        return (
            <Form.Check
                checked={value}
                disabled={disabled}
                onChange={(event) => table.options.meta?.updateData(rowId, columnId, event.target.checked)}
            />
        )
    }

    return (<Form.Control
        className='editable-cell'
        style={style}
        disabled={disabled}
        type={type}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
    />)
}