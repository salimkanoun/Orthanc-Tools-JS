import React, { useCallback, useEffect, useMemo, useState } from "react";
import NestedTable from "./NestedTable";
import { commonColumns, patientColumns } from "./ColumnFactories";
import TableStudies from "./TableStudies";

export default ({
    onClickStudy = () => { },
    onClickPatient,
    patients,
    onRemovePatient,
    onRemoveStudy,
    onDeletePatient,
    onDeleteStudy,
    onSelectStudies,
    onModify,
    refresh,
    actionButton,
    removeRow,
    selectable,
    openLabelModal
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

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === focusedStudy) return { background: 'peachPuff' }
    }

    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.ID(),
        patientColumns.NAME(),
        ...(actionButton ? [patientColumns.ACTION(onDeletePatient, onModify, refresh)] : []),
        ...(removeRow ? [patientColumns.REMOVE(onRemovePatient)] : [])
    ], [
        onDeletePatient,
        onDeleteStudy,
        onModify,
        refresh,
        openLabelModal]);



    const getExpandedRow = (rowId) => {
        let patient = patients.filter((patient) => patient.PatientOrthancID === rowId)[0]
        let studies = Object.values(patient['Studies'])

        const onSelectStudy = (selectedStudies) => {
            let selectedStudiesOrthancId = selectedStudies.map((study => {
                return study.StudyOrthancID
            }))
            updateselectedIds(selectedStudiesOrthancId)
        }
        //SK Issue renvoie une nouvelle instance du composant qui perd son state
        return <TableStudies key={rowId} studies={studies} onRowClick={onClickStudyHandler} rowStyle={rowStyle} onSelectRow={onSelectStudy} selectable={selectable} removeRow={removeRow} onRemoveStudy={onRemoveStudy} actionButton={actionButton} />
    }

    const updateselectedIds = (newIds) => {
        let sumArray = [
            ...selectedStudies,
            ...newIds
        ]
        let uniqueIds = [...new Set(sumArray)];
        setSelectedStudies(uniqueIds)

    }
    const onSelectPatient = (selectedPatients) => {
        let selectedStudiesOrthancId = []
        selectedPatients.map((patient => {
            let studyOrthancIds = Object.values(patient.Studies).map((study) => study.StudyOrthancID)
            selectedStudiesOrthancId.push(...studyOrthancIds)
        }))
        updateselectedIds(selectedStudiesOrthancId)
    }

    return <NestedTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={patients} getExpandedRow={getExpandedRow} onSelectRow={onSelectPatient} selectable={selectable}
        rowStyle={rowStyle} rowEvent={onClickPatient} actionButton />
}