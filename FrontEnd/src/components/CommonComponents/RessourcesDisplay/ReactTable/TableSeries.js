import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {commonColumns, seriesColumns, studyColumns} from "./ColumnFactories";

function TableSeries({
                         series,
                         onDelete,
                         refresh,
                         hiddenActionBouton,
                         hiddenRemoveRow,
                         rowEvents,
                         rowStyle,
                         pagination
                     }) {
    const columns = useMemo(() => [
        commonColumns.RAW,
        seriesColumns.ORTHANC_ID,
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
        ...(!hiddenActionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(!hiddenRemoveRow ? [studyColumns.REMOVE(onDelete)] : [])
    ], [
        hiddenActionBouton, hiddenRemoveRow, onDelete, refresh]);
    const data = useMemo(() => series.map(x => ({
        raw: {...x},
        ...x
    })), [series]);
    return <CommonTable columns={columns} tableData={data} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TableSeries;