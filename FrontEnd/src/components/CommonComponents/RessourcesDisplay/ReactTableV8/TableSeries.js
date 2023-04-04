import React from "react";
import CommonTableV8 from "./CommonTableV8";

export default ({
    series, 
    additionalColumns = []
}) => {

    const columns = [
        {
            id: 'SeriesOrthancID',
            accessorKey: 'SeriesOrthancID',
            header: 'SeriesOrthancID',
            hidden: true,
        },
        {
            id: 'SeriesDescription',
            accessorKey: 'SeriesDescription',
            header: 'SeriesDescription',
            filterType: "STRING",
        },
        {
            id: 'Modality',
            accessorKey: 'Modality',
            header: 'Modality',
            filterType: "STRING"
        },
        {
            id: 'SeriesNumber',
            accessorKey: 'SeriesNumber',
            header: 'SeriesNumber',
            filterType: "NUMBER"
        }
    ]

    return (
        <CommonTableV8 data={series} columns={columns.concat(additionalColumns)}/>
    )
}