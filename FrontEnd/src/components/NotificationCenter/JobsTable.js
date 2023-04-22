import React from "react"
import CommonTableV8 from "../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"
import { Button } from "react-bootstrap"

export default ({ jobs }) => {

    const columns = [
        {
            id: 'JobID',
            accessorKey: 'data.ID',
            header: "Job ID",
            enableHiding: true
        },
        {
            accessorKey: 'content',
            header: 'Type',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            accessorKey: 'data.State',
            header: "Job Status",
            style: { whiteSpace: 'normal', wordWrap: 'break-word' },
            cell: ({ getValue }) => getValue() ?? 'Unknown'
        },
        {
            header: 'Details',
            cell: () => <Button > Show Details </Button>
        }
    ]

    return (
        <CommonTableV8 columns={columns} data={jobs} />
    )

}