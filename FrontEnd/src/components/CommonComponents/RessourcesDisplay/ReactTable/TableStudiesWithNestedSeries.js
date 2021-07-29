import React, {useMemo} from "react";
import NestedTable from "./NestedTable";
import {seriesArrayToStudyArray} from "../../../../tools/processResponse";
import {commonColumns, seriesColumns, studyColumns} from "./ColumnFactories";

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
        study.series = Object.entries(study.series).map(([ID, values]) => ({
            SeriesOrthancID: ID, ...values,
            raw: {SeriesOrthancID: ID, ...values}
        }))
        study.raw = {...study};
        return study;
    }), [studies, series]);
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        studyColumns.ANONYMIZED_FROM,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        ...(!hiddenAccessionNumber ? [studyColumns.ACCESSION_NUMBER] : []),
        ...(!hiddenActionBouton ? [studyColumns.ACTION(onDelete, refresh)] : []),
        ...(!hiddenRemoveRow ? [studyColumns.REMOVE(onDelete)] : []),
        {
            accessor: "series",
            table: [
                commonColumns.RAW,
                seriesColumns.ORTHANC_ID,
                seriesColumns.DESCRIPTION,
                seriesColumns.MODALITY,
                seriesColumns.SERIES_NUMBER,
                ...(!hiddenActionBouton ? [seriesColumns.ACTION(onDelete, refresh)] : []),
                ...(!hiddenRemoveRow ? [seriesColumns.REMOVE(onDelete)] : [])
            ]
        }
    ], [
        onDelete,
        refresh,
        hiddenAccessionNumber,
        hiddenActionBouton,
        hiddenRemoveRow]);

    return <NestedTable columns={columns} data={data} setSelected={() => {
    }} hiddenSelect={true}/>
}

export default TableStudiesWithNestedSeries;