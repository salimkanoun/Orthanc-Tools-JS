import CommonTable from "./CommonTable";
import {useMemo} from "react";
import {columnSeriesFactory} from "./ColumnFactories";

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
    const columns = useMemo(() => columnSeriesFactory(hiddenActionBouton, hiddenRemoveRow, onDelete, refresh), [
        hiddenActionBouton, hiddenRemoveRow, onDelete, refresh]);
    const data = useMemo(() => series, [series]);
    return <CommonTable columns={columns} tableData={data} rowEvents={rowEvents}
                        rowStyle={rowStyle} pagination={pagination}/>
}

export default TableSeries;