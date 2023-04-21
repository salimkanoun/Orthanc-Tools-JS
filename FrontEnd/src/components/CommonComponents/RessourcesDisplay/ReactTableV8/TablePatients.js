import React from "react";

import CommonTableV8 from "./CommonTableV8";

export default ({ patients }) => {


    const columns = [
        patientColumns.ID(textIDColumn),
        {
            id: 'raw',
            accessorrKey: 'raw',
            header: 'RAW',
            enableHiding: true
        },
        {
            id: 'PatientOrthancID',
            accessorrKey: 'PatientOrthancID',
            header: 'PatientOrthancID',
            enableHiding: true
        },
        {
            id: 'PatientName',
            accessorrKey: 'PatientName',
            header: 'Patient Name',
            filterType: "STRING"
        },
        {
            id: 'PatientID',
            accessorrKey: 'PatientID',
            header: 'Patient ID',
            filterType: "STRING"
        },
        {
            id: 'newPatientID',
            accessorrKey: 'newPatientID',
            header: 'New Patient ID',
            isEditable: true,
            editionProperties: {}
        },
        {
            id: 'newPatientName',
            accessorrKey: 'newPatientName',
            header: 'New Patient Name',
            isEditable: true,
            editionProperties: {}
        },
    ]

    const data = useMemo(() => patients.map(x => ({
        raw: { ...x },
        ...x
    })), [patients]);

    return (
        <CommonTableV8 data={data} columns={columns} />
    )
}