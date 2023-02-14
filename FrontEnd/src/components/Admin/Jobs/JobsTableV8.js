import React, { useMemo } from "react";
import { Button } from "react-bootstrap";

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import ModalDetailsV8 from "./ModalDetailsV8";

export default ({ rows, dropDown }) => {

    const data = useMemo(() => rows, [rows]);

    const columnsJobs = [
        {
            id: 'ID',
            accessorKey: 'ID',
            header: "ID",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "STRING",
            isEditable : true,
        },
        {
            id: 'Progress',
            accessorKey: 'Progress',
            header: "Progress",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "NUMBER",
        },
        {
            id: 'State',
            accessorKey: 'State',
            header: "State",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "STRING",
            enableColumnFilter: false,
        },
        {
            id: 'Details',
            accessorKey: 'Details',
            header: "Details" ,
            cell: (({ row }) => {
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={() => {row.toggleExpanded()}}>Details</Button></div>)
            }),
            enableColumnFilter: false,
        },
        {
            id: 'Actions',
            accessorKey: 'Actions',
            header: "Actions",
            cell: (({ row }) => {
                return dropDown(row.original.Content.ID)
            }),
            enableColumnFilter: false,
        }
    ]
    
    const renderSubComponent = ({row}) => {
        return <ModalDetailsV8 data={[row.original]} />
    }

    return (
        <>
            <CommonTableV8 columns={columnsJobs} data={data} canSort canFilter paginated canSelect canExpand renderSubComponent={renderSubComponent}/>
        </>
    )
}