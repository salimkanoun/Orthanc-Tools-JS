import React from "react";
import SelectCheckBox from "./SelectCheckBox";

export const selectColumn = {
    id: 'selection',
    accessorKey: 'selection',
    enableColumnFilter: false,
    disableExport: true,
    enableSorting: false,
    header: ({ table }) => (
        <SelectCheckBox
            {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
            }}
        />
    ),
    cell: ({ row }) => (
        <div>
            <SelectCheckBox
                {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                }}
            />
        </div>
    ),
}

