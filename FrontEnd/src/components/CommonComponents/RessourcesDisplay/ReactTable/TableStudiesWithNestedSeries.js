import { useMemo } from "react"
import { commonColumns, patientColumns, studyColumns } from "./ColumnFactories"
import NestedTable from "./NestedTable"
import TableSeries from "./TableSeries"


export default ({ 
    series,
    studies,
    removeRow,
    accessionNumber,
    actionButton,
    withPatientColums,
    onRemoveStudy,
    onRemoveSeries,
    onDeleteStudy,
    onModify,
    refresh,
    pagination,
}) => {

    const getExpandedRow = (rowId) => {
        const seriesObject = series.filter(serie => serie.StudyOrthancID === rowId)
        return <TableSeries series={seriesObject} removeRow onRemove={onRemoveSeries} />
    }

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

    return <NestedTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} data={studies} getExpandedRow={getExpandedRow}
         removeRow/>

}