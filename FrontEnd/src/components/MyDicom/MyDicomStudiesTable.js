import React from 'react'
import TableStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies'
import ActionButtonStudies from './ActionButtons/ActionButtonStudies'

export default ({ studies = [], onClickStudy}) => {

    const additionalColumnsStudies = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return <ActionButtonStudies
                    StudyInstanceUID={row.original.StudyInstanceUID}
                    onDelete={() => onDeleteStudy(row.original.StudyOrthancID)}
                    onShowLabels={() => setLabelStudyOrthancId(row.original.StudyOrthancID)}
                    dataDetails={row.original}
                    onShowModify={() => setModifyOrthancID({ orthancID: row.original.StudyOrthancID, level: ConstantLevel.STUDIES })}
                    onShowCreate={() => setCreateOrthancID({ orthancID: row.original.StudyOrthancID, level: ConstantLevel.STUDIES })}

                />
            }
        }
    ]

    return (
        <TableStudies studies={studies} onRowClick={onClickStudy} additionalColumns={additionalColumnsStudies} />
    )
}