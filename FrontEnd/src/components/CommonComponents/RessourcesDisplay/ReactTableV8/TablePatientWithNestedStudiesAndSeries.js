import React from "react";

import CommonTableV8 from "./CommonTableV8";
import TableStudiesWithNestedSeries from "./TableStudiesWithNestedSeries";
import { patientColumns } from "./ColomnFactories";

export default ({
    patients
}) => {

    const columns = [
        patientColumns.ORTHANC_ID,
        patientColumns.ID,
        patientColumns.NAME,
    ]

    const renderSubComponent = ({ row }) => {
        let rowId = row.id
        let patient = patients.find((patient) => patient.PatientOrthancID === rowId)
        let studies = Object.values(patient.Studies)
        let series = []
        studies.forEach(study => {
            series.push(...Object.values(study.Series))
        })
        return <TableStudiesWithNestedSeries canExpand studies={studies} series={series} />
    }

    return <CommonTableV8 id={patientColumns.ORTHANC_ID.id} canExpand columns={columns} data={patients} renderSubComponent={renderSubComponent} />

}