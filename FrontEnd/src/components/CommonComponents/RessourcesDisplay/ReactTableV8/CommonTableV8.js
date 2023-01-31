import React from "react";
import { flexRender, 
    getCoreRowModel, 
    useReactTable,
    columnDef,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

export default ({ 
    columns, 
    data,
    canSort = false,
    sortBy = []
}) => {

    const [sorting, setSorting] = useState(sortBy);

    const table = useReactTable({
        data ,
        columns ,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSorting: canSort,
        enableSortingRemoval: true,
        enableMultiSort: true,
        maxMultiSortColCount: 3,
        isMultiSortEvent: () => true,
        debugTable: true,
    });



    console.log(table)

    return (
        <>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : <>
                                        <div 
                                        {...{
                                            className : header.column.getCanSort()
                                            ? header.column.columnDef.headerClassName + ' cursor-pointer select-none'
                                            : header.column.columnDef.headerClassName,
                                            onClick : header.column.getToggleSortingHandler(),
                                        }}
                                        >
                                            { flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                            
                                        )}
                                        {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted()] ?? null}
                                            </div>
                                            </>
                            }
                                </th>
                            })}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>
        </>
    )
}