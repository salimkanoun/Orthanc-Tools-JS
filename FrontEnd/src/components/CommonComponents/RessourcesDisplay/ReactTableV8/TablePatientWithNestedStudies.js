import React, { useEffect, useState } from "react";
import { commonColumns, patientColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";
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
        patientColumns.ORTHANC_ID,
        patientColumns.ID,
        patientColumns.NAME,
    ]

    const columnsPatients = columns.concat(additionalColumnsPatients)

    const renderSubComponent = ({row}) => {
        let rowId = row.id
        let patient = patients.find((patient) => patient.PatientOrthancID === rowId)
        let studies = Object.values(patient.Studies)

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

    return <CommonTableV8 id={patientColumns.ORTHANC_ID.id} canExpand columns={columnsPatients} data={patients} renderSubComponent={renderSubComponent} />
 
}