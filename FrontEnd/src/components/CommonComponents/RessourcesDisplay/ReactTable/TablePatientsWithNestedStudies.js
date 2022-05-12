import React, { Component, useEffect, useMemo, useState } from "react";
import NestedTable from "./NestedTable";
import { commonColumns, patientColumns, studyColumns } from "./ColumnFactories";
import TableStudies from "./TableStudies";

export default ({
    rowStyle,
    onClickStudy,
    onClickPatient,
    patients,
    onDeletePatient,
    onDeleteStudy,
    onModify,
    refresh,
    actionButton,
    removeRow,
    onSelectStudies,
    selectable,
    openLabelModal
}) => {


    const [selectedStudies, setSelectedStudies] = useState([])

    useEffect(() => {
        console.log(selectedStudies)
        //onSelectStudies(selectedStudies)
    }, [selectedStudies])

    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.ID(),
        patientColumns.NAME(),
        ...(actionButton ? [patientColumns.ACTION(onDeletePatient, onModify, refresh)] : []),
        ...(removeRow ? [patientColumns.REMOVE(onDeletePatient)] : [])
    ], [
        onDeletePatient,
        onDeleteStudy,
        onModify,
        refresh,
        openLabelModal]);

    const getExpandedRow = (rowId) => {
        let patient = patients.filter((patient) => patient.PatientOrthancID === rowId)[0]
        let studies = Object.values(patient['studies'])

        const onSelectStudy = (selectedStudies) => {
            console.log(selectedStudies)
            let selectedStudiesOrthancId = []
            selectedStudies.map((study => {
                selectedStudiesOrthancId.push(study.StudyOrthancID)
            }))
            //updateselectedIds(selectedStudiesOrthancId)
        }
        return <TableStudies getRowId={(originalRow) => originalRow.PatientOrthancID} studies={studies} onRowClick={onClickStudy} rowStyle={rowStyle} onSelectRow={onSelectStudy} selectable={selectable} actionButton />
    }

    const updateselectedIds = (newIds) => {
        console.log(newIds)
        let sumArray = [
            ...selectedStudies,
            ...newIds
        ]
        console.log(newIds)
        let uniqueIds = [...new Set(sumArray)];
        console.log(newIds)
        console.log(uniqueIds)
        setSelectedStudies(uniqueIds)

    }
    const onSelectPatient = (selectedPatients) => {
        console.log(selectedPatients)
        let selectedStudiesOrthancId = []
        selectedPatients.map((patient => {
            let studyOrthancIds = Object.values(patient.studies).map((study) => study.StudyOrthancID)
            selectedStudiesOrthancId.push(...studyOrthancIds)
        }))
        updateselectedIds(selectedStudiesOrthancId)
    }

    return <NestedTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={patients} getExpandedRow={getExpandedRow} onSelectRow={onSelectPatient} selectable={selectable}
        rowStyle={rowStyle} rowEvent={onClickPatient} actionButton />
}