import React from "react";

import { Button } from "react-bootstrap";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ data, onDataUpdate, onDeleteTag }) => {

    const columns = [
        {
            id: 'TagName',
            accessorKey: 'TagName',
            header: 'Tag Name',
        }, {
            id: 'Value',
            accessorKey: 'Value',
            header: 'Value',
            isEditable: true
        }, {
            id: 'delete',
            header: 'Deleted',
            cell: (({ row }) => {
                return <Button variant='danger' onClick={() => onDeleteTag(row.original.TagName)} >Delete</Button>
            })
        }
    ]

    return <CommonTableV8  onCellEdit={onDataUpdate} id={'TagName'} columns={columns} data={data} />
}