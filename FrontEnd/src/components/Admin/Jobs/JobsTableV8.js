import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ handleDetails, rows, dropDown}) => {

    const data = useMemo(() => rows, [rows]);

    const columns = [
        {
            id: 'ID',
            accessorKey: 'ID',
            header: () => <span>ID</span>,
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'Progress',
            accessorKey: 'Progress',
            header: () => <span> Progress</span>,
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'State',
            accessorKey: 'State',
            header: () => <span> State</span>,
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'Details',
            accessorKey: 'Details',
            header: () => <span> Details </span>,
            cell: (({ row }) => {
                console.log(row);
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={() => handleDetails(row.index)}>Details</Button></div>)
            })
        },
        {
            id: 'Actions',
            accessorKey: 'Actions',
            header: () => <span>Actions</span>,
            cell: (({ row }) => {
                return dropDown(row.original.Content.ID)
            })
        }
    ]

    return <CommonTableV8 columns={columns} data={data} />
}