import CommonTable from "./CommonTable";
import { useMemo } from "react";
import { commonColumns, patientColumns, studyColumns } from "./ColumnFactories";

export default ({
    studies,
    onDeleteStudy,
    onModify,
    refresh,
    actionButton,
    removeRow,
    onRemoveStudy,
    withPatientColums=false,
    rowEvents,
    rowStyle,
    onRowClick,
    onSelectStudies = () => {},
    pagination,
    selectable,
    onSelectRow,
}) => {

    const columns = useMemo(() => [
        commonColumns.RAW,
        ...(withPatientColums ? [patientColumns.PARENT_NAME()] : []),
        ...(withPatientColums ? [patientColumns.PARENT_ID()] : []),
        studyColumns.ORTHANC_ID,
        studyColumns.STUDY_INSTANCE_UID,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER,
        ...(actionButton ? [studyColumns.ACTION(onDeleteStudy, onModify, refresh)] : []),
        ...(removeRow ? [studyColumns.REMOVE(onRemoveStudy)] : [])
    ], [onDeleteStudy, refresh]);
    
    return <CommonTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} data={studies} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} onRowClick={onRowClick} selectable={selectable} onSelectRow={onSelectRow} />
}