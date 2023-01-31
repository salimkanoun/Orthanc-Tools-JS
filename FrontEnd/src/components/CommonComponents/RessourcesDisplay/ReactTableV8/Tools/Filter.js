import React, { useMemo } from "react";

export default ({ 
    column, 
    columnDef,
    table,
}) =>
{
    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()]
    )

    return <></>
}