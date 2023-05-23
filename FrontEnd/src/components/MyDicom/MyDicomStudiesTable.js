import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from 'react-bootstrap'

import TableStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies'
import ActionButtonStudies from './ActionButtons/ActionButtonStudies'
import { addStudiesToExportList } from '../../actions/ExportList'

export default ({ studies = [], onClickStudy }) => {

    const [selectedStudies, setSelectedStudies] = useState([])

    const dispatch = useDispatch()

    const onSelectStudy = (selectedStudies) => {
        let selectedStudiesOrthancId = selectedStudies.map((StudyOrthancID => {
            return StudyOrthancID
        }))
        setSelectedStudies(selectedStudiesOrthancId)
    }

    const onSendExport = () => {
        let selectedStudiesObject = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))
        dispatch(addStudiesToExportList(selectedStudiesObject))
    }

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
            <Button className="otjs-button otjs-button-orange w-10 m-3" onClick={() => onSendExport()} >To Export</Button>
            <TableStudies canSelect studies={studies} onRowClick={onClickStudy} additionalColumns={additionalColumnsStudies} selectedRowsIds={selectedStudies} onSelectRow={onSelectStudy} />
        </>
    )
}