import React from 'react'
import { useDispatch } from 'react-redux'

import TablePatientWithNestedStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies'
import { patientColumns, studyColumns } from '../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories'
import { removePatientFromDeleteList, removeStudyFromDeleteList } from '../../actions/DeleteList'

export default ({ patientRows }) => {

    const dispatch = useDispatch()

    const onRemovePatient = (patientOrthancID) => {
        dispatch(removePatientFromDeleteList(patientOrthancID))
    }

    const onRemoveStudy = (studyOrthancID) => {
        dispatch(removeStudyFromDeleteList(studyOrthancID))
    }

    const additionalColumnsPatients = [
        patientColumns.REMOVE(onRemovePatient)
    ]

    const additionalColumnsStudies = [
        studyColumns.REMOVE(onRemoveStudy)
    ]

    return (
        <TablePatientWithNestedStudies
            patients={patientRows}
            additionalColumnsPatients={additionalColumnsPatients}
            additionalColumnsStudies={additionalColumnsStudies}
        />
    )
}