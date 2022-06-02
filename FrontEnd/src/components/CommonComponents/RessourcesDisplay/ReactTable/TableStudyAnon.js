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
        ...(showEditable ? [
            studyColumns.NEW_DESCRIPTION,
            studyColumns.NEW_ACCESSION_NUMBER
        ] : []),
        ...(actionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(removeRow ? [studyColumns.REMOVE(onRemoveStudy)] : []),
        ...(anonymized ? [studyColumns.ANONYMIZED] : [])
    ] , [actionBouton, removeRow, showEditable, anonymized,]
    )

return <CommonTable columns={columns} data={studies} pagination={pagination} />

}