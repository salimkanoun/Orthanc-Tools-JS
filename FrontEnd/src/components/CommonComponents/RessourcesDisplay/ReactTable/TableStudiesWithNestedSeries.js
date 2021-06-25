import React, {useMemo} from "react";
import NestedTable from "./NestedTable";
import {seriesArrayToStudyArray} from "../../../../tools/processResponse";
import {columnSeriesFactory, columnStudyFactory} from "./ColumnFactories";

function TableStudiesWithNestedSeries({
                                          studies,
                                          series,
                                          onDelete,
                                          onModify,
                                          refresh,
                                          hiddenAccessionNumber,
                                          hiddenActionBouton,
                                          hiddenRemoveRow,
                                      }) {
    if (hiddenActionBouton === undefined) hiddenActionBouton = true;
    if (hiddenRemoveRow === undefined) hiddenRemoveRow = true;
    const data = useMemo(() => seriesArrayToStudyArray(series, studies).map(study => {
        study.series = Object.entries(study.series).map(([ID, values]) => ({SeriesOrthancID: ID, ...values}))
        return study;
    }), [studies, series]);
    const columns = useMemo(() => {
        let studiesColumns = columnStudyFactory(hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, false, false, onDelete, refresh);
        let seriesColumns = columnSeriesFactory(hiddenActionBouton, hiddenRemoveRow, onDelete, refresh);
        studiesColumns.push({
            accessor: "series",
            table: seriesColumns
        });
        return studiesColumns;
    }, [
        onDelete,
        onModify,
        refresh,
        hiddenAccessionNumber,
        hiddenActionBouton,
        hiddenRemoveRow]);

    return <NestedTable columns={columns} data={data} setSelected={() => {
    }} hiddenSelect={true}/>
}

export default TableStudiesWithNestedSeries;