import React, {useMemo} from "react";
import NestedTable from "./NestedTable";
import {columnPatientsFactory, columnSeriesFactory, columnStudyFactory} from "./ColumnFactories"


function TablePatientsWithNestedStudiesAndSeries({
                                                     patients,
                                                     onDelete,
                                                     onModify,
                                                     refresh,
                                                     hiddenAccessionNumber,
                                                     hiddenActionBouton,
                                                     hiddenRemoveRow,
                                                 }) {
    if (hiddenActionBouton === undefined) hiddenActionBouton = true;
    if (hiddenRemoveRow === undefined) hiddenRemoveRow = true;
    const data = useMemo(() => patients.map(patient => {
        patient.studies = Object.entries(patient.studies)
            .map(([key, val]) => ({StudyOrthancID: key, ...val}))
        patient.studies.forEach(study => {
            study.series = Object.entries(study.series)
                .map(([key, val]) => ({
                    SeriesOrthancID: key, ...val,
                    raw: {SeriesOrthancID: key, ...val}
                }))
            study.raw = {...study};
        })
        patient.raw = {...patient};
        return patient;
    }), [patients]);
    const columns = useMemo(() => {
        let patientsColumns = columnPatientsFactory(
            hiddenActionBouton,
            hiddenRemoveRow,
            onDelete,
            onModify,
            refresh);
        let studiesColumns = columnStudyFactory(hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, true, true, onDelete, refresh);
        let seriesColumns = columnSeriesFactory(hiddenActionBouton, hiddenRemoveRow, onDelete, refresh);
        patientsColumns.push({
            accessor: "studies",
            table: studiesColumns
        });
        studiesColumns.push({
            accessor: "series",
            table: seriesColumns
        });
        return patientsColumns;
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


export default TablePatientsWithNestedStudiesAndSeries;
