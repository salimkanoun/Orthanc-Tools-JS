import React, { useEffect, useState } from "react";
import { commonColumns, patientColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";
import TableStudies from "./TableStudies";

//TODO : gerer deselection
//gerer selection parent => selection study
export default ({
    patients,
    additionalColumnsPatients = [],
    additionalColumnsStudies = [],
    onSelectPatient  = () => {},
    onSelectStudies = () => {},
    selectablePatient = false,
    selectableStudy = false,
    rowStyle = undefined,
    onClickStudy = () => { },
}) => {
    const [selectedStudies, setSelectedStudies] = useState([])
    const [focusedStudy, setFocusedStudy] = useState(null)

    useEffect(() => {
        console.log(selectedStudies)
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

    const renderSubComponent = ({ row }) => {
        let rowId = row.id
        let patient = patients.find((patient) => patient.PatientOrthancID === rowId)
        let studies = Object.values(patient.Studies)

        const onSelectStudy = (selectedStudies) => {
            let selectedStudiesOrthancId = selectedStudies.map((StudyOrthancID => {
                console.log(StudyOrthancID)
                return StudyOrthancID
            }))
            updateselectedIds(selectedStudiesOrthancId)
        }

        return <TableStudies studies={studies} additionalColumns={additionalColumnsStudies} onRowClick={onClickStudyHandler} rowStyle={rowStyle} selectable={selectableStudy} onSelect={onSelectStudy} />
    }

    const updateselectedIds = (newIds) => {
        let sumArray = [
            ...selectedStudies,
            ...newIds
        ]
        let uniqueIds = [...new Set(sumArray)];
        setSelectedStudies(uniqueIds)

    }

    return <CommonTableV8 id={patientColumns.ORTHANC_ID.id} canExpand columns={columnsPatients} data={patients} renderSubComponent={renderSubComponent} canSelect={selectablePatient} />

}