import React from "react"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"
import ActionButtonSeries from "./ActionButtons/ActionButtonSeries"

export default ({
    series = [],
    onDelete
}) => {

    const additionalColumns = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return (
                    <ActionButtonSeries
                        orthancID={row.original.SeriesOrthancID}
                        onDelete={onDelete}
                        dataDetails = {row.original}
                    />)
            }
        }]

    return (
        <TableSeries series={series} additionalColumns={additionalColumns} />
    )
}