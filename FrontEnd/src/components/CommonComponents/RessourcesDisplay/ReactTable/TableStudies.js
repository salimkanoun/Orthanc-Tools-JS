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
    onRemoveStudy,
    rowEvents,
    rowStyle,
    onRowClick,
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
        ...(removeRow ? [studyColumns.REMOVE(onRemoveStudy)] : [])
    ], [onDeleteStudy, refresh]);
    
    return <CommonTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} data={studies} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} onRowClick={onRowClick} selectable={selectable} onSelectRow={onSelectRow} />
}

export default TableStudies;