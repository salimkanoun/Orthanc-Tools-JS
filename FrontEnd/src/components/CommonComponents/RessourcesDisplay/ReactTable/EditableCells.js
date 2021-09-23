import React from "react";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import {FormControl} from "react-bootstrap";

export function InputCell({
                              value: initialValue,
                              row: {values},
                              column: {id, accessor, type},
                              onDataChange,
                          }) {
    type = type || 'text'

    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
    const [toggled, setToggled] = React.useState(false)

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);


    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        setToggled(false);
        if (onDataChange) onDataChange(initialValue, value, values, id || accessor)
    }

    return toggled ? <FormControl autoFocus={true} type={type} value={value} onChange={onChange} onBlur={onBlur}
        /> :
        <div style={{'height': '100%', 'minWidth': '50px', padding: 0, display: 'flex'}}
             onClick={() => {
                 if (values.editable === undefined || values.editable) setToggled(true)
             }}>
            <p>{value}</p>
        </div>

}

export function SelectCell({
                               value: initialValue,
                               row: {values},
                               column: {id, accessor, options},
                               onDataChange, // This is a custom function that we supplied to our table instance
                           }) {

    const [value, setValue] = React.useState(null);

    const onChange = value => {
        setValue(value);
        if (onDataChange) onDataChange(initialValue, value.value, values, id || accessor)
    }

    return <div>
        <AsyncSelect className={'react-select'} single defaultOptions value={value}
                     loadOptions={() => options().then(res => {
                         setValue(res.find(x => x.value === initialValue))
                         return res;
                     })} onChange={onChange}
                     style={{'min-width': '100px'}}
                     menuPosition={'fixed'}
        />
    </div>

}
