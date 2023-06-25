import React from "react"
import TableSeries from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"

export default ({series = []}) => {
    return (
        <TableSeries series={series}/>
    )
}