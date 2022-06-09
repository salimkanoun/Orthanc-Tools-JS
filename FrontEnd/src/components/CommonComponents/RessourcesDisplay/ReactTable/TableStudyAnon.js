import { useMemo } from "react";
import { commonColumns, studyColumns } from "./ColumnFactories";
import CommonTable from "./CommonTable";

export default (
    {
        studies,
        actionBouton,
        onDelete,
        refresh,
        removeRow,
        onRemoveStudy,
        showEditable,
        anonymized,
        pagination
    }
) => {
    const columns = useMemo(()=>[
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        studyColumns.ANONYMIZED_FROM,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        ...(actionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(removeRow ? [studyColumns.REMOVE(onRemoveStudy)] : []),
        ...(anonymized ? [studyColumns.ANONYMIZED] : [])
    ] , [actionBouton, onDelete, onRemoveStudy, refresh, removeRow, showEditable, anonymized,]
    )

return <CommonTable columns={columns} data={studies} pagination={pagination} />

}