import React from "react";

import { Form } from "react-bootstrap";

import CommonTableV8 from "../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ data, modifications, deleted, onCellEdit, onDeleteTag }) => {

    console.log(data)
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
            isEditable: true
        }, {
            id: 'deletable',
            accessorKey: 'deletable',
            header: 'Deletable',
            enableHiding: true
        }, {
            id: 'deleted',
            accessorKey: 'deleted',
            header: 'Deleted',
            cell: (({ getValue, row }) => {
                return <Form.Check checked={getValue()} onChange={(event) => onDeleteTag(row.original.tagName, event.target.checked)} />
            })
        }
    ]

    console.log(prepareData(data))

    return <CommonTableV8 onCellEdit={onCellEdit} id='tagName' columns={columns} data={prepareData(data)} />
}