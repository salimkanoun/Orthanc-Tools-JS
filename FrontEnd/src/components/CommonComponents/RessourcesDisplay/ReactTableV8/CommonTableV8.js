import React from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    columnDef,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { useState, useEffect, useCallback } from "react";

import Paginate from "./Tools/Paginate";
import Filter from "./Tools/Filter";


export default ({
    columns,
    data,
    canSort = false,
    canFilter = false,
    paginated = false,
    sortBy = []
}) => {

    const [sorting, setSorting] = useState(sortBy);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableSorting: canSort,
        enableFilters: canFilter,
        enableSortingRemoval: true,
        enableMultiSort: true,
        maxMultiSortColCount: 3,
        isMultiSortEvent: () => true,
        debugTable: true,
    });


    return (
        <>
            <table className="table table-striped">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        :
                                        <> <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? header.column.columnDef.headerClassName + ' cursor-pointer select-none'
                                                    : header.column.columnDef.headerClassName,
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} columnDef={header.column.columnDef} table={table} />
                                                </div>
                                            ) : null}
                                        </>}
                                </th>
                            ))}
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
            {
                paginated ?
                    <div className="d-flex justify-content-end">
                        <Paginate
                            gotoPage={table.setPageIndex}
                            previousPage={table.previousPage}
                            nextPage={table.nextPage}
                            canPreviousPage={table.getCanPreviousPage()}
                            canNextPage={table.getCanNextPage()}
                            pageIndex={table.getState().pagination.pageIndex}
                            pageCount={table.getPageCount()}
                            pageSize={table.getState().pagination.pageSize}
                            setPageSize={table.setPageSize}
                            rowsCount={table.getPrePaginationRowModel().rows.length}
                        />
                    </div>
                    :
                    null
            }
        </>
    )
}

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip]
}