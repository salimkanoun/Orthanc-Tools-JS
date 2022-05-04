import React, { Component, useMemo } from "react";
import NestedTable from "./NestedTable";
import { commonColumns, patientColumns, studyColumns } from "./ColumnFactories";
import CommonTable from "./CommonTable";


function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function TablePatientsWithNestedStudies({
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
    setSelected,
    hiddenSelect,
    openLabelModal
}) {

    console.log(patients)

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

    return <NestedTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={patients} getExpandedRow={getExpandedRow} setSelected={setSelected} hiddenSelect={hiddenSelect}
        rowStyle={rowStyle} rowEvent={onClickPatient} />
}

class TablePatientsWithNestedStudiesWrapper extends Component {
    selected = {
        root: [],
        sub: []
    }

    getSelectedRessources() {
        return {
            selectedPatients: this.selected.root.map(x => x.PatientOrthancID),
            selectedStudies: this.selected.sub.map(x => x.root).flat().map(x => x.StudyOrthancID)
        };
    }


    render() {
        return <TablePatientsWithNestedStudies {...this.props} setSelected={(s) => {
            this.selected = mergeDeep(this.selected, s);
            if (this.props.setSelectedStudies) this.props.setSelectedStudies(this.getSelectedRessources())
        }} />
    }
}

export default TablePatientsWithNestedStudiesWrapper;