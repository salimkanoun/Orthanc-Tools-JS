import React, { useEffect, useState } from "react";

import { patientColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";
import TableStudies from "./TableStudies";

export default ({
    patients,
    additionalColumnsPatients = [],
    additionalColumnsStudies = [],
    onSelectStudies,
    selectablePatient = false,
    selectableStudy = false,
    rowStyle,
    onClickStudy = () => { },
}) => {
    const [selectedStudies, setSelectedStudies] = useState([])
    const [focusedStudy, setFocusedStudy] = useState(null)

    useEffect(() => {
        onSelectStudies(selectedStudies)
    }, [selectedStudies])

    const onClickStudyHandler = (StudyOrthancID) => {
        setFocusedStudy(StudyOrthancID)
        onClickStudy(StudyOrthancID)
    }


    const columns = [
        patientColumns.ORTHANC_ID,
        patientColumns.ID,
        patientColumns.NAME,
    ]

    const columnsPatients = columns.concat(additionalColumnsPatients)

    const onSelectPatientHandle = (selectedPatientOrthancIds) => {
        let selectedPatients = patients.filter((patient) => selectedPatientOrthancIds.includes(patient.PatientOrthancID))
        let studies = []
        selectedPatients.forEach(patient => studies.push(...patient.Studies))
        let studiesOrthancIds = studies.map(study => study.StudyOrthancID)
        setSelectedStudies(studiesOrthancIds)
    }

    const renderSubComponent = (row) => {
        let rowId = row.id
        let patient = patients.find((patient) => patient.PatientOrthancID === rowId)
        let studies = Object.values(patient.Studies)

        const onSelectStudy = (selectedStudies) => {
            let selectedStudiesOrthancId = selectedStudies.map((StudyOrthancID => {
                return StudyOrthancID
            }))
            setSelectedStudies(selectedStudiesOrthancId)
        }

        return <TableStudies studies={studies} selectedRowsIds={selectedStudies} additionalColumns={additionalColumnsStudies} onRowClick={onClickStudyHandler} rowStyle={rowStyle} canSelect={selectableStudy} onSelectRow={onSelectStudy} />
    }

    return <CommonTableV8 id={patientColumns.ORTHANC_ID.id} canExpand columns={columnsPatients} data={patients} renderSubComponent={renderSubComponent} canSelect={selectablePatient} onSelectRow={onSelectPatientHandle} />

}