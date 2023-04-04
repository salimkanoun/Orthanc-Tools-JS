import React from "react";
import CommonTableV8 from "./CommonTableV8";

export default ({
    studies,
    additionalColumns = [],
    rowStyle,
    onRowClick,
}) => {

    const columns = [
        {
            id : 'raw',
            accessorKey : 'raw',
            header : 'Raw',
            hidden : true
        },
        {
            id : 'StudyOrthancID',
            accessorKey : 'StudyOrthancID',
            header : 'Study Orthanc ID',
            hidden : true,
        },
        {
            id : 'StudyInstanceUID',
            accessorKey : 'StudyInstanceUID',
            header : 'StudyInstanceUID',
            hidden : true
        },
        {
            id : 'StudyDate',
            accessorKey : 'StudyDate',
            header : 'Acquisition Date',
            filterType : "DATE"
        },
        {
            id : 'StudyDescription',
            accessorKey : 'StudyDescription',
            header : 'Description',
            filterType : "STRING"
        },
        {
            id : 'AccessionNumber',
            accessorKey : 'AccessionNumber',
            header : 'Accession Number',
            filterType : "NUMBER"
        }
    ]

    return (
        <CommonTableV8 data={studies} columns={columns.concat(additionalColumns)} rowStyle={rowStyle} onRowClick={onRowClick}/>
    )
}