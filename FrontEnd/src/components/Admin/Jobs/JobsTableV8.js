import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ handleDetails, rows, dropDown}) => {

    const data = useMemo(() => rows, [rows]);

    /*const [showDetail, setShowDetail] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState('')

    const handleDetails = (index) => {
        setShowDetail(true)
        setCurrentRowIndex(index)
    }*/

    const columnsJobs = [
        {
            id: 'ID',
            accessorKey: 'ID',
            header: () => <span>ID</span>,
            cell: row => <i>{row.getValue()}</i>,
            filterType : "STRING",
        },
        {
            id: 'Progress',
            accessorKey: 'Progress',
            header: () => <span> Progress</span>,
            cell: row => <i>{row.getValue()}</i>,
            filterType : "NUMBER",
        },
        {
            id: 'State',
            accessorKey: 'State',
            header: () => <span> State</span>,
            cell: row => <i>{row.getValue()}</i>,
            filterType : "STRING",
            enableColumnFilter : false,
        },
        {
            id: 'Details',
            accessorKey: 'Details',
            header: () => <span> Details </span>,
            cell: (({ row }) => {
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={() => handleDetails(row.index)}>Details</Button></div>)
            }),
            enableColumnFilter : false,
        },
        {
            id: 'Actions',
            accessorKey: 'Actions',
            header: () => <span>Actions</span>,
            cell: (({ row }) => {
                return dropDown(row.original.Content.ID)
            }),
            enableColumnFilter : false,
        }
    ]

    return <CommonTableV8 columns={columnsJobs} data={data} canSort canFilter paginated/>
}