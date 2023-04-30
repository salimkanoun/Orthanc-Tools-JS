import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { filter } from "../../../../../model/Constant";

export default ({
    column,
    columnDef,
    table,
}) => {
    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()]
    )

    if (columnDef.filterType === filter.DATE_FILTER) {

        //Get Min and Max available date (excluding null)
        let dateArray = sortedUniqueValues.filter(date => date !== null);
        let max = new Date(Math.max.apply(null, dateArray))
        let min = new Date(Math.min.apply(null, dateArray))

        const [filterMinimum, setFilterMinimum] = useState(null)
        const [filterMaximum, setFilterMaximum] = useState(null)

        useEffect(() => {
            column.setFilterValue([
                filterMinimum ? new Date(filterMinimum) : null,
                filterMaximum ? new Date(filterMaximum) : null
            ])
        }, [filterMinimum, filterMaximum])

        return (
            <div onClick={(e) => e.stopPropagation()} //Prevent click from triggering sorting
            >
                <div>
                    <DatePicker
                        isClearable
                        dateFormat="MM/dd/yyyy"
                        minDate={min ? min : new Date(1990, 1, 1)}
                        maxDate={max ? max : new Date()}
                        selected={filterMinimum}
                        onChange={(date) => setFilterMinimum(date)}
                        customInput={<CustomInput/>}
                    />
                </div>
                <div>
                    <DatePicker
                        isClearable
                        dateFormat="MM/dd/yyyy"
                        minDate={min ? new Date(min) : new Date(1990, 1, 1)}
                        maxDate={max ? new Date(max) : new Date()}
                        selected={filterMaximum}
                        onChange={(date) => setFilterMaximum(date?.setHours(23, 59, 59, 999))}
                        customInput={<CustomInput/>}
                    />
                </div>
            </div>
        )
    }


    if (columnDef.filterType === filter.NUMBER_FILTER) {
        const facetedMinMaxValues = column.getFacetedMinMaxValues();
        return (
            <div>
                <Form.Control
                    type="number"
                    min={Number(facetedMinMaxValues?.[0] ?? undefined)}
                    max={Number(facetedMinMaxValues?.[1] ?? undefined)}
                    value={(columnFilterValue)?.[0] ?? ''}
                    onChange={event => {
                        let value = event.target.valueAsNumber
                        column.setFilterValue((old) => [value, old?.[1]])
                    }
                    }
                    placeholder={`Min`}
                />
                <Form.Control
                    type="number"
                    min={Number(facetedMinMaxValues?.[0] ?? undefined)}
                    max={Number(facetedMinMaxValues?.[1] ?? undefined)}
                    value={(columnFilterValue)?.[1] ?? ''}
                    onChange={event => {
                        let value = event.target.valueAsNumber
                        column.setFilterValue((old) => [old?.[0], value])
                    }
                    }
                    placeholder={`Max`}
                />
            </div>
        )
    }

    if (columnDef.filterType === filter.SELECT_FILTER) {

        return (
            <>
                <div className='c_select__wrapper' >
                    <Select
                        menuPosition='absolute'
                        classNamePrefix='c_select'
                        className='c_select w-100'
                        isSearchable
                        isClearable
                        options={sortedUniqueValues
                            .slice(0, 5000)
                            .map((value) => ({
                                value: value,
                                label: value
                            }))}
                        value={(columnFilterValue ? { value: columnFilterValue, label: columnFilterValue } : null)}
                        placeholder='Filter...'
                        onChange={(option) => column.setFilterValue(option?.value)}
                    />
                </div>
            </>
        )
    }

    if (columnDef.filterType === filter.MULTI_SELECT_FILTER) {

        const [inverted, setInverted] = useState(false)
        const [selectedOptions, setSelectedOptions] = useState([])

        const options = useMemo(() => {
            return sortedUniqueValues
                .slice(0, 5000)
                .map((value) => ({
                    value: value,
                    label: value
                }))
        }, [sortedUniqueValues])

        const refreshFilter = () => {
            const selectedValues = selectedOptions.map((option) => option.value);
            if (inverted) {
                column.setFilterValue(
                    options.filter(option => !selectedValues.includes(option.value)).map(option => option.value)
                )
            } else {
                column.setFilterValue(selectedValues)
            }
        }

        useEffect(() => {
            refreshFilter()
        }, [selectedOptions.length, inverted])

        return (
            <div>
                <Select
                    menuPosition='absolute'
                    isSearchable
                    isClearable
                    isMulti
                    options={options}
                    value={selectedOptions}
                    placeholder='Filter...'
                    onChange={(options) => {
                        setSelectedOptions(options)
                    }}
                />
                <Button className="w-100" variant={inverted ? 'warning' : 'primary'} onClick={() => setInverted(inverted => !inverted)}>Invert</Button>
            </div>
        )
    }

    //Input by default
    return (
        <DebouncedInput
            value={columnFilterValue ?? ''}
            onChange={value => column.setFilterValue(value)}
            placeholder="search"
        />
    )

}

const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <Form.Control {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

const CustomInput = React.forwardRef(
    ({ value, onClick }, ref) => (
        <Form.Control
            type='text'
            className='form-control m-1'
            ref={ref}
            defaultValue={value}
            onClick={onClick}
        />
    )
)