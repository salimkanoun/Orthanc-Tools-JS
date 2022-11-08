import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import CommonTable from "./CommonTable";

export default ({ data, modifications, deleted, onDataUpdate, onDeleteTag }) => {
    
    const prepareData = () => {
        let dataPrepare = []
        for (let [key, value] of Object.entries(data)) {
            dataPrepare.push({
                tagName: key,
                editable: true,
                deleted : deleted.includes(key),
                value: value ,
                newValue : modifications?.[key]
            })
        }
        return dataPrepare;
    }

    const columns = [
        {
            accessor: 'tagName',
            Header: 'Tag name',
        }, {
            Header : 'New Value',
            accessor : 'newValue',
            Cell : ({ value, row }) => {
                return (<Form.Control disabled = {!row.original.editable} value={value ?? ''} onChange={(event) => onDataUpdate(row.original.tagName, event.target.value)} />)
            },
        }, {
            accessor: 'deletable',
            show: false
        }, {
            accessor: 'value',
            Header: 'Value',
        }, {
            accessor: 'deleted',
            Header: 'Deleted',
            Cell: ({ value, row }) => {
                return <Form.Check checked={value} onChange={(event)=> onDeleteTag(row.original.tagName, event.target.checked) } />
            }
        }
    ]

    return <CommonTable getRowId={(originalRow) => originalRow.tagName} data={prepareData(data)} columns={columns} />
}
