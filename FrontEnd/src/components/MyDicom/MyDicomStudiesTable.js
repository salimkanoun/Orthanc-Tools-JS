import React from 'react'

import TableStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies'
import ActionButtonStudies from './ActionButtons/ActionButtonStudies'

export default ({ studies = [], onClickStudy, onSelectStudy, selectedStudies }) => {

    const additionalColumnsStudies = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return <ActionButtonStudies
                    StudyInstanceUID={row.original.StudyInstanceUID}
                />
            }
        }
    ]

    return (
        <>
            <TableStudies canSelect studies={studies} onRowClick={onClickStudy} additionalColumns={additionalColumnsStudies} selectedRowsIds={selectedStudies} onSelectRow={onSelectStudy} />
        </>
    )
}