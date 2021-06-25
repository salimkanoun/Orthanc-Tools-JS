import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {columnPatientsFactory} from "./ColumnFactories";

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
    const columns = useMemo(() => columnPatientsFactory(
        hiddenActionBouton,
        hiddenRemoveRow,
        onDelete,
        onModify,
        refresh,
        showEditable,
        textNameColumn,
        textIDColumn), [
        hiddenActionBouton,
        hiddenRemoveRow,
        onDelete,
        onModify,
        refresh,
        showEditable,
        textNameColumn,
        textIDColumn]);
    const data = useMemo(() => patients, [patients]);
    return <CommonTable columns={columns} tableData={data} onDataChange={onDataChange} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TablePatients;