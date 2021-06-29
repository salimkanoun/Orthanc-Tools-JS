//Common filter for searching by a text on a Column (just removing spaces in our case)
import Select from "react-select";
import {FormControl} from "react-bootstrap";

export function InputFilter(label = '', type = 'text') {
    return ({
                column: {filterValue, setFilter, ...props},

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
            <div>
                <Select single options={OPTIONS_DATE_FILTER} value={filterValue.comp}
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


const dateFilterComp = {
    '<=': (row, col, date) => Date.parse(row.values[col]) <= Date.parse(date),
    '=': (row, col, date) => Date.parse(row.values[col]) === Date.parse(date),
    '>=': (row, col, date) => Date.parse(row.values[col]) >= Date.parse(date),
}

export function dateFilter(rows, col, val) {
    console.log(val);
    console.log(rows)
    if (!val.date || val.comp.value === '~') return rows;
    return rows.filter(row => dateFilterComp[val.comp.value](row, col[0], val.date));
}
