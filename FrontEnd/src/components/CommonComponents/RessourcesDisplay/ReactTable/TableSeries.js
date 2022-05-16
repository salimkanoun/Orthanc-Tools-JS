import CommonTable from "./CommonTable";
import { useMemo } from "react";
import { seriesColumns } from "./ColumnFactories";

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
        seriesColumns.ORTHANC_ID,
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
        ...(!hiddenActionBouton ? [seriesColumns.ACTION(onDelete, refresh)] : []),
        ...(!hiddenRemoveRow ? [seriesColumns.REMOVE(onDelete)] : [])
    ], [onDelete, refresh]);

    return <CommonTable getRowId={(row) => row.SeriesOrthancID} columns={columns} data={series} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} />
}

export default TableSeries;