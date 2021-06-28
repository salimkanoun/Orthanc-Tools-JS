import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {columnStudyFactory} from "./ColumnFactories";

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
    const columns = useMemo(() => columnStudyFactory(hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh, showEditable, hiddenAnonymized), [
        hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh, showEditable, hiddenAnonymized]);
    const data = useMemo(() => studies, [studies]);
    return <CommonTable columns={columns} tableData={data} onDataChange={onDataChange} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TableStudy;