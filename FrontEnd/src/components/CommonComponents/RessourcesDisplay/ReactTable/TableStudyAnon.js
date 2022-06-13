import { useMemo } from "react";
import { commonColumns, studyColumns } from "./ColumnFactories";
import CommonTable from "./CommonTable";
import { EditableCell } from "./EditableCells";

export default (
    {
        studies,
        actionBouton,
        onDelete,
        refresh,
        removeRow,
        onRemoveStudy,
        showEditable,
        onEdit,
        anonymized,
        pagination
    }
) => {
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        studyColumns.ANONYMIZED_FROM,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,

        ...(showEditable ? [
            {
                accessor: 'newStudyDescription',
                Header: 'New Description',
                Cell: ({ value, row }) => {
                    return (<EditableCell value={value} onChange={(newValue) => onEdit(row.id, 'newStudyDescription', newValue)} />)
                },
                style: { whiteSpace: 'normal', wordWrap: 'break-word' }
            },
            {
                accessor: 'newAccessionNumber',
                Header: 'New Accession Number',
                Cell: ({ value, row }) => {
                    return (<EditableCell value={value} onChange={(newValue) => onEdit(row.id, 'newAccessionNumber', newValue)} />)
                },
                style: { whiteSpace: 'normal', wordWrap: 'break-word' }
            },
        ] : []),

        ...(actionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(removeRow ? [studyColumns.REMOVE(onRemoveStudy)] : []),
        ...(anonymized ? [studyColumns.ANONYMIZED] : [])
    ], [
        actionBouton,
        onDelete,
        onRemoveStudy,
        refresh,
        removeRow,
        showEditable,
        anonymized,]
    )

    const data = useMemo(() => studies.map(x => ({
        raw: { ...x },
        ...x
    })), [studies]);

    return <CommonTable getRowId={(originalRow) => originalRow.StudyOrthancID} columns={columns} data={data} pagination={pagination} />

}