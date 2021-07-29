import React, {useMemo} from "react";
import NestedTable from "./NestedTable";
import {commonColumns, patientColumns, seriesColumns, studyColumns} from "./ColumnFactories"


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
    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.ID(),
        patientColumns.NAME(),
        ...(!hiddenActionBouton ? [patientColumns.ACTION(onDelete, onModify, refresh)] : []),
        ...(!hiddenRemoveRow ? [patientColumns.REMOVE(onDelete)] : []),
        {
            accessor: "studies",
            table: [
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
            ]
        }
    ], [
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
