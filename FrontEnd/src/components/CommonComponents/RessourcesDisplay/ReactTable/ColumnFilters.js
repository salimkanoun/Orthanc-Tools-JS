//Common filter for searching by a text on a Column (just removing spaces in our case)
import Select from "react-select";
import {Button, FormControl} from "react-bootstrap";

export function InputFilter(label = '', type = 'text') {
    return ({
                column: {filterValue, setFilter},

            }) => {
        return (
            <FormControl
                type={type}
                placeholder={label}
                value={filterValue || ''}
                className='form-control'
                onChange={e => {
                    setFilter(e.target.value.replace(' ', '') || undefined) // Set undefined to remove the filter entirely
                }}
            />
        )
    }
}

export function SelectFilter(label = 'Select...', options = []) {
    return ({
                column: {filterValue, setFilter},
            }) => {
        return (
            <Select isMulti options={options} value={filterValue}
                    onChange={(value => setFilter(value))} menuPosition={'fixed'}/>
        )
    }
}

export function InvertableDataFilter(label = '') {
    return ({
                column: {id, filterValue, setFilter},
                data
            }) => {

        filterValue = filterValue || {
            inverted: false,
            value: []
        }
        const options = [...new Set(data.map(row => row[id]))].map(x => ({
            value: x,
            label: x
        }))
        return (
            <div className={'d-flex flex-column'}>
                <Select className={'react-select'} isMulti options={options} placeholder={label}
                        value={filterValue.value} menuPosition={'fixed'}
                        onChange={(value => setFilter({value: value, inverted: filterValue.inverted}))}/>
                <Button variant={filterValue.inverted ? 'primary' : "outline-primary"}
                        onClick={() => setFilter({value: filterValue.value, inverted: !filterValue.inverted})}>
                    {filterValue.inverted ? <strong>{'inverted'}</strong> : 'invert'}
                </Button>
            </div>
        )
    }
}

function checkRow(row, col, selectors) {
    return selectors.reduce((prev, selector) => prev || row.values[col[0]] === selector.value, false);
}

export function invertableDataFilter(rows, col, {inverted, value}) {
    return rows.filter(row => (!inverted === checkRow(row, col, value)) || !value.length);
}

export function selectFilter(rows, col, value) {
    return rows.filter(row => checkRow(row, col, value) || !value.length);
}

const OPTIONS_DATE_FILTER = [
    {value: '~', label: 'Ignore'},
    {value: '<=', label: 'Before'},
    {value: '=', label: 'Match'},
    {value: '>=', label: 'After'},
]

export function DateFilter(label = 'Select...') {
    return ({
                column: {filterValue, setFilter},
            }) => {
        filterValue = filterValue || {
            comp: {value: '~', label: 'Ignore'},
            date: null
        }
        return (
            <div className={'d-flex flex-column'}>
                <Select className={'react-select'} single options={OPTIONS_DATE_FILTER} value={filterValue.comp}
                        onChange={(value) => {
                            filterValue.comp = value;
                            setFilter(filterValue);
                        }} menuPosition={'fixed'}/>
                <FormControl
                    type={'date'}
                    placeholder={label}
                    value={filterValue.date}
                    className='form-control'
                    onChange={e => {
                        filterValue.date = e.target.value;
                        setFilter(filterValue);
                    }}
                />
            </div>
        )
    }
}

function DicomDateToMs(date) {
    return Date.parse(date.substring(0, 4) + '-' +
        date.substring(4, 6) + '-' +
        date.substring(6, 8));
}

const dateFilterComp =
    {
        '<=': (row, col, date) => DicomDateToMs(row.values[col]) <= Date.parse(date),
        '=': (row, col, date) => DicomDateToMs(row.values[col]) === Date.parse(date),
        '>=': (row, col, date) => DicomDateToMs(row.values[col]) >= Date.parse(date),
    }

export function dateFilter(rows, col, val) {
    if (!val.date || val.comp.value === '~') return rows;
    return rows.filter(row => dateFilterComp[val.comp.value](row, col[0], val.date));
}
