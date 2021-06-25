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
                       }) {
    const columns = useMemo(() => columnPatientsFactory(
        hiddenActionBouton,
        hiddenRemoveRow,
        onDelete,
        onModify,
        refresh), [
        hiddenActionBouton,
        hiddenRemoveRow,
        onDelete,
        onModify,
        refresh]);
    const data = useMemo(() => patients, [patients]);
    return <CommonTable columns={columns} tableData={data}/>
}