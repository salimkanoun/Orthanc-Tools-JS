import React from "react";
import { Form } from "react-bootstrap";
import CommonTable from "./CommonTable";

export default ({ data, onDataUpdate }) => {

    console.log(data)

    data = [{
        TagName : 'non editable',
        editable : false,
        Value : 'B',
        newValue : null
    }, 
    {
        TagName : 'editable',
        editable : true,
        Value : 'B',
        newValue : null
    }]

    const columns = [
        {
            accessor: 'TagName',
            Header: 'Tag name',
        }, {
            Header : 'New Value',
            accessor : 'newValue',
            Cell : ({ value, row }) => {
                console.log(value)
                return (<Form.Control disabled = {!row.original.editable} value={value ?? ''} onChange={(event) => onDataUpdate('newValue', event.target.value)} />)
            },

        }, {
            accessor: 'deletable',
            show: false
        }, {
            accessor: 'Value',
            Header: 'Value',
        }, {
            accessor: 'Delete',
            Header: 'Delete',
            Cell: ({
                value: initialValue,
                row: { values },
                column: { id, accessor },
                onDataChange, // This is a custom function that we supplied to our table instance
            }) => {
                const [value, setValue] = React.useState(initialValue)

                // We need to keep and update the state of the cell normally
                const onChange = e => {
                    setValue(e.target.checked);
                    onDataChange(initialValue, e.target.checked, values, id || accessor);
                }

                // If the initialValue is changed external, sync it up with our state
                React.useEffect(() => {
                    setValue(initialValue)
                }, [initialValue])

                return ((values.deletable === undefined || values.deletable) ?
                    <input type={'checkbox'} checked={value} onChange={onChange} /> : 'Mandatory')
            }
        }
    ]
    return <CommonTable data={data} columns={columns} />
}
