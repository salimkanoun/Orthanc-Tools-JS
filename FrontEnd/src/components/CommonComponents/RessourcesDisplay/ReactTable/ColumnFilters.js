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
            <Select single options={options} value={options.find(x => x.value === filterValue)}
                    onChange={(value => setFilter(value.value))}/>
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
            value: ''
        }
        const options = [...new Set(data.map(row => row[id]))].map(x => ({
            value: x,
            label: x
        }))
        return (
            <div className={'d-flex'}>
                <Button variant={filterValue.inverted ? 'primary' : "outline-primary"}
                        onClick={() => setFilter({value: filterValue.value, inverted: !filterValue.inverted})}>
                    {filterValue.inverted ? <strong>{'inverted'}</strong> : 'invert'}
                </Button>
                <Select className={'react-select'} single options={options} placeholder={<label for=""></label>}
                        value={options.find(x => x.value === filterValue.value)}
                        onChange={(value => setFilter({value: value.value, inverted: filterValue.inverted}))}/>
            </div>
        )
    }
}

export function invertableDataFilter(rows, col, {inverted, value}) {
    return rows.filter(row => (!inverted === (row.values[col[0]] === value)) || value === '')
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
            <div style={{display: "flex"}}>
                <Select className={'react-select'} single options={OPTIONS_DATE_FILTER} value={filterValue.comp}
                        onChange={(value) => {
                            filterValue.comp = value;
                            setFilter(filterValue);
                        }}/>
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


const dateFilterComp =
    {
        '<=': (row, col, date) => Date.parse(row.values[col]) <= Date.parse(date),
        '=': (row, col, date) => Date.parse(row.values[col]) === Date.parse(date),
        '>=': (row, col, date) => Date.parse(row.values[col]) >= Date.parse(date),
    }

export function dateFilter(rows, col, val) {
    if (!val.date || val.comp.value === '~') return rows;
    return rows.filter(row => dateFilterComp[val.comp.value](row, col[0], val.date));
}
