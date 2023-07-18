import React, { useMemo } from "react";
import { commonColumns, patientColumns } from "./ColomnFactories";

import CommonTableV8 from "./CommonTableV8";

export default ({ patients, additionalColumns = [], onRowClick, rowStyle, onCellEdit }) => {

    const columns = [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.NAME,
        patientColumns.ID,
    ]

    const data = useMemo(() => patients.map(x => ({
        raw: { ...x },
        ...x
    })), [patients]);

    return (
        <CommonTableV8 id="PatientOrthancID" data={data} columns={[...columns, ...additionalColumns]} rowStyle={rowStyle} onRowClick={onRowClick} onCellEdit={onCellEdit} />
    )
}