import React, { Component, useEffect, useMemo, useState } from "react";
import NestedTable from "./NestedTable";
import { commonColumns, patientColumns, studyColumns } from "./ColumnFactories";
import CommonTable from "./CommonTable";

export default ({
    rowStyle,
    onClickStudy,
    onClickPatient,
    patients,
    onDeletePatient,
    onDeleteStudy,
    onModify,
    refresh,
    hiddenAccessionNumber,
    hiddenActionBouton,
    hiddenRemoveRow,
    onSelectStudies,
    hiddenSelect,
    openLabelModal
}) => {


    const [selectedStudies, setSelectedStudies] = useState([])

    useEffect(()=> {
        //onSelectStudies(selectedStudies)
    }, selectedStudies)

    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.ID(),
        patientColumns.NAME(),
        ...(!hiddenActionBouton ? [patientColumns.ACTION(onDeletePatient, onModify, refresh)] : []),
        ...(!hiddenRemoveRow ? [patientColumns.REMOVE(onDeletePatient)] : [])
    ], [
        onDeletePatient,
        onDeleteStudy,
        onModify,
        refresh,
        hiddenAccessionNumber,
        hiddenActionBouton,
        hiddenRemoveRow,
        openLabelModal]);

    const getExpandedRow = (rowId) => {

        console.log(rowId)
        const columns = [
            commonColumns.RAW,
            studyColumns.ORTHANC_ID,
            studyColumns.STUDY_INSTANCE_UID,
            studyColumns.DATE,
            studyColumns.DESCRIPTION,
            studyColumns.ACCESSION_NUMBER,
            ...(!hiddenActionBouton ? [studyColumns.ACTION(onDeleteStudy, onModify, refresh)] : []),
            ...(!hiddenRemoveRow ? [studyColumns.REMOVE(onDeleteStudy)] : [])
        ];
        let patient = patients.filter((patient) => patient.PatientOrthancID === rowId)[0]

        return <CommonTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} tableData={Object.values(patient['studies'])} onRowClick={onClickStudy} rowStyle={rowStyle}
        />
    }

    const onSelectPatient = (selectedPatients) => {
        console.log(selectedPatients)
        let selectedStudiesOrthancId = []
        selectedPatients.map((patient=> {
            selectedStudiesOrthancId.push(patient.studies)
        }))
        setSelectedStudies(selectedStudiesOrthancId)
    }

    return <NestedTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={patients} getExpandedRow={getExpandedRow} onSelectPatient={onSelectPatient} hiddenSelect={hiddenSelect}
        rowStyle={rowStyle} rowEvent={onClickPatient} />
}