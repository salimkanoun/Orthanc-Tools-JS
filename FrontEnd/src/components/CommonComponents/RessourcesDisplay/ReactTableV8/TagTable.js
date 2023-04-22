import React from "react";

import { Form } from "react-bootstrap";

import CommonTableV8 from "./CommonTableV8";

export default ({ data, modifications, deleted, onDataUpdate, onDeleteTag }) => {

    const prepareData = () => {
        let dataPrepare = []
        for (let [key, value] of Object.entries(data)) {
            dataPrepare.push({
                tagName: key,
                editable: true,
                deleted: deleted.includes(key),
                value: value,
                newValue: modifications?.[key]
            })
        }
        return dataPrepare;
    }

    const columns = [
        {
            id: 'tagName',
            accessorKey: 'tagName',
            header: 'Tag Name',
        }, {
            id: 'value',
            accessorKey: 'value',
            header: 'Value'
        }, {
            id: 'newValue',
            accessorKey: 'newValue',
            header: 'New Value',
            cell: (({ value, row }) => {
                return (<Form.Control disabled={!row.original.editable} value={value ?? ''} onChange={(event) => onDataUpdate(row.original.tagName, event.target.value)} />)
            })
        }, {
            id: 'deletable',
            accessorKey: 'deletable',
            header: 'Deletable',
            enableHiding: true
        }, {
            id: 'deleted',
            accessorKey: 'deleted',
            header: 'Deleted',
            cell: (({ value, row }) => {
                return <Form.Check checked={value} onChange={(event) => onDeleteTag(row.original.tagName, event.target.checked)} />
            })
        }
    ]

    return <CommonTableV8 id={(originalRow) => originalRow.tagName} columns={columns} data={prepareData(data)} />
}