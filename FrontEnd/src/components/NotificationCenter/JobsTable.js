import React from "react"
import CommonTableV8 from "../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"

export default ({jobs}) => {

    const columns =[
        {
            accessorKey: 'data.id',
            header: "Job ID",
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            accessorKey: 'data.status',
            header: "Job Status",
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
    ]

    return (
        <CommonTableV8 columns = {columns} data = {jobs } />
    )

}