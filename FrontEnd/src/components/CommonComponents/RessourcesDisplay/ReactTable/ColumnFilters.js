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

