import CommonTable from "./CommonTable";
import { useMemo } from "react";
import { seriesColumns } from "./ColumnFactories";

export default ({
    series,
    onDeleteSeries  = (seriesOrthancID)=> {},
    onRemove = (seriesOrthancID)=> {},
    actionButton = false,
    removeRow = false,
    onRowClick,
    rowStyle,
    pagination = true
}) => {
    const columns = useMemo(() => [
        seriesColumns.ORTHANC_ID, 
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
        //SK ACTION BUTTON A REVOIR
        ...(actionButton ? [seriesColumns.ACTION(onDeleteSeries)] : []),
        ...(removeRow ? [seriesColumns.REMOVE(onRemove)] : [])
    ], []);

    return <CommonTable getRowId={(row) => row.SeriesOrthancID} columns={columns} data={series} onRowClick={onRowClick}
        rowStyle={rowStyle} pagination={pagination} />
}