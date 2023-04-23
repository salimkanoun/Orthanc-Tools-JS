import React from 'react'
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

export default ({ rows }) => {

    const columns = [{
        accessorKey: 'key',
        enableHiding: true
    },
    {
        accessorKey: 'Level',
        header: 'Level'
    },
    {
        accessorKey: 'PatientName',
        header: 'Patient Name'
    }, {
        accessorKey: 'PatientID',
        header: 'Patient ID'
    }, {
        accessorKey: 'AccessionNumber',
        header: 'Accession Number'
    }, {
        accessorKey: 'DateFrom',
        header: 'Date From'
    }, {
        accessorKey: 'DateTo',
        header: 'Date To'
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description'
    }, {
        accessorKey: 'SeriesDescription',
        header: 'Series Description'
    },
    {
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
    }, {
        accessorKey: 'OriginAET',
        header: 'AET',
    }, {
        accessorKey: 'Status',
        header: 'Status',
    }];

    return (
        <>
            <CommonTableV8 columns={columns} data={rows} />
        </>
    )
}