import CommonTable from "./CommonTable";
import { useMemo } from "react";
import { commonColumns, studyColumns } from "./ColumnFactories";

function TableStudies({
    studies,
    onDeleteStudy,
    onModify,
    refresh,
    actionButton,
    removeRow,
    rowEvents,
    rowStyle,
    pagination,
    selectable,
    onSelectRow,
}) {
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.STUDY_INSTANCE_UID,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER,
        ...(actionButton ? [studyColumns.ACTION(onDeleteStudy, onModify, refresh)] : []),
        ...(removeRow ? [studyColumns.REMOVE(onDeleteStudy)] : [])
    ], [onDeleteStudy, refresh]);
    
    return <CommonTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} data={studies} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} selectable={selectable} onSelectRow={onSelectRow} />
}

export default TableStudies;