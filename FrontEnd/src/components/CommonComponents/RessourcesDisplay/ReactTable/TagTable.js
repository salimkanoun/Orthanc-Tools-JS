import {EditableCell} from "./ColumnFactories";
import React from "react";
import CommonTable from "./CommonTable";

export function TagTable({data, onDataUpdate}) {
    const columns = [
        {
            accessor: 'TagName',
            Header: 'Tag name',
        }, {
            accessor: 'editable',
            show: false
        }, {
            accessor: 'deletable',
            show: false
        }, {
            accessor: 'Value',
            Header: 'Value',
            Cell: EditableCell
        }, {
            accessor: 'Delete',
            Header: 'Delete',
            Cell: ({
                       value: initialValue,
                       row: {values},
                       column: {id, accessor},
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
                    <input type={'checkbox'} checked={value} onChange={onChange}/> : 'Mandatory')
            }
        }
    ]
    return <CommonTable tableData={data} columns={columns} onDataChange={onDataUpdate}/>
}