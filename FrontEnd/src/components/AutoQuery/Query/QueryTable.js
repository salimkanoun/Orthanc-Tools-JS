import React, { useMemo, useState } from 'react'

import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default () => {

    const columns = useMemo(() => [{
        id: 'key',
        accessorKey: 'key',
        enableHiding: true
    }, {
        accessorKey: 'PatientName',
        header: 'Patient Name',
    }, {
        accessorKey: 'PatientID',
        header: 'Patient ID'
    }, {
        accessorKey: 'AccessionNumber',
        header: 'Accession Number'
    }, {
        accessorKey: 'DateFrom',
        header: 'Date From',
    }, {
        accessorKey: 'DateTo',
        header: 'Date To',
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description'
    }, {
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
        cell: ({ getValue }) => {
            return () => {
                const [value, setValue] = useState(getValue());
                const onChange = value => {
                    //setValue(value);
                    //if (onDataChange) onDataChange(initialValue, value, values, id || accessor);
                }

                return (
                    <div>
                        <SelectModalities previousModalities={value} onUpdate={onChange} />
                    </div>
                )
            }
        }
    }, {
        accessorKey: 'Aet',
        header: 'AET',
        //options: async () => aets.map(aet => ({ value: aet, label: aet })),
    }], []);

    return (
        <CommonTableV8 columns={columns} data={[]} />
    )
}