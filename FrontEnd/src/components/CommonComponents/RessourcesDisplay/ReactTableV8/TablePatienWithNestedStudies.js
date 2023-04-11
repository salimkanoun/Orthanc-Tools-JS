import React, { useEffect, useState } from "react";
import { commonColumns, patientColumns } from "./ColomnFactories";
import NestedTableV8 from "./NestedTableV8";
import TableStudies from "./TableStudies";

export default ({
    patients,
    additionalColumnsPatients = [],
    additionalColumnsStudies  = [],
    onSelectStudies,
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
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.ID,
        patientColumns.NAME,
    ]

    const columnsPatients = columns.concat(additionalColumnsPatients)

    const renderSubComponent = (rowId) => {
        let patient = patients.filter((patient) => patient.PatientOrthancID === rowId)[0]
        let studies = Object.values(patient['Studies'])

        const onSelectStudy = (selectedStudies) => {
            let selectedStudiesOrthancId = selectedStudies.map((study => {
                return study.StudyOrthancID
            }))
            updateselectedIds(selectedStudiesOrthancId)
        }

        return <TableStudies studies={studies} additionalColumns={additionalColumnsStudies} onRowClick={onClickStudyHandler}/>
    }

    const updateselectedIds = (newIds) => {
        let sumArray = [
            ...selectedStudies,
            ...newIds
        ]
        let uniqueIds = [...new Set(sumArray)];
        setSelectedStudies(uniqueIds)

    }

    return <NestedTableV8 columnsTable={columnsPatients} data={patients} renderSubComponent={() => renderSubComponent} />
 
}