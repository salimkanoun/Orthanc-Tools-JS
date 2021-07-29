import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {commonColumns, patientColumns} from "./ColumnFactories";

function TablePatients({
                           patients,
                           onDelete,
                           onModify,
                           refresh,
                           hiddenActionBouton,
                           hiddenRemoveRow,
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
        ...(!hiddenActionBouton ? [patientColumns.ACTION(onDelete, onModify, refresh)] : []),
        ...(!hiddenRemoveRow ? [patientColumns.REMOVE(onDelete)] : [])
    ], [
        hiddenActionBouton,
        hiddenRemoveRow,
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
    return <CommonTable columns={columns} tableData={data} onDataChange={onDataChange} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TablePatients;