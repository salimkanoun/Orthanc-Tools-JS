import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {commonColumns, patientColumns, studyColumns} from "./ColumnFactories";

function TableStudy({
                        studies,
                        onDelete,
                        refresh,
                        hiddenActionBouton,
                        hiddenRemoveRow,
                        hiddenAccessionNumber, hiddenName, hiddenID, hiddenAnonymized,
                        onDataChange,
                        showEditable = false,
                        rowEvents,
                        rowStyle,
                        pagination
                    }) {
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        studyColumns.ANONYMIZED_FROM,
        ...(!hiddenName ? [patientColumns.NAME()] : []),
        ...(!hiddenID ? [patientColumns.ID()] : []),
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        ...(!hiddenAccessionNumber ? [studyColumns.ACCESSION_NUMBER] : []),
        ...(showEditable ? [
            studyColumns.NEW_DESCRIPTION,
            studyColumns.NEW_ACCESSION_NUMBER
        ] : []),
        ...(!hiddenActionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(!hiddenRemoveRow ? [studyColumns.REMOVE(onDelete)] : []),
        ...(!hiddenAnonymized ? [studyColumns.ANONYMIZED] : [])
    ], [
        hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh, showEditable, hiddenAnonymized]);
    const data = useMemo(() => studies.map(x => ({
        raw: {...x},
        ...x
    })), [studies]);
    return <CommonTable columns={columns} tableData={data} onDataChange={onDataChange} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TableStudy;