import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {commonColumns, patientColumns} from "./ColumnFactories";

function TablePatients({
                           patients,
                           onDelete ,
                           onRemovePatient,
                           onModify,
                           refresh,
                           actionBouton,
                           removeRow,
                           onRowClick,
                           onDataChange,
                           textNameColumn = 'Patient Name',
                           textIDColumn = 'Patient ID',
                           showEditable = false,
                           rowEvents,
                           rowStyle,
                           pagination
                       }) {
    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.NAME(textNameColumn),
        patientColumns.ID(textIDColumn),
        ...(showEditable ? [
            patientColumns.NEW_NAME,
            patientColumns.NEW_ID
        ] : []),
        ...(actionBouton ? [patientColumns.ACTION(onDelete, onModify, refresh)] : []),
        ...(removeRow ? [patientColumns.REMOVE(onRemovePatient)] : [])
    ], [
        actionBouton,
        removeRow,
        onDelete,
        onModify,
        refresh,
        showEditable,
        textNameColumn,
        textIDColumn]);
    const data = useMemo(() => patients.map(x => ({
        raw: {...x},
        ...x
    })), [patients]);
    return <CommonTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={data} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination} onRowClick={onRowClick} />
}

export default TablePatients;