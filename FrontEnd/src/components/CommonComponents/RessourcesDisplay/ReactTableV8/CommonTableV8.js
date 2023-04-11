import React, { useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useState } from "react";

import Paginate from "./Tools/Paginate";
import Filter from "./Tools/Filter";
import EditableCell from "./Tools/EditableCell";
import { selectColumn } from "./Tools/TableUtils";

export default ({
    columns,
    data,
    id = 'id',
    canSort = false,
    canFilter = false,
    canSelect = false,
    canExpand = false,
    paginated = false,
    customRowProps = (row) => { },
    sortBy = [],
    renderSubComponent,
    onRowClick = () => { }, 
    rowStyle = () => { }, 
    onSelectRow = (state) => { },
    selectedIds = null,
    onCellEdit = (rowIndex, columnId, value) => { },
}) => {

    const [sorting, setSorting] = useState(sortBy);
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState([])
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    useEffect(() => {
        onSelectRow(Object.keys(rowSelection))
    }, [Object.keys(rowSelection).length])

    //TODO controlled behaviour for selection
    /*
    useEffect(()=> {
        if(!selectedIds) return 
        const generateSelectedState = (selectedIds) => {
            let state = {}
            selectedIds.forEach((id)=> state[id] = true)
            return state
        }

        setRowSelection(generateSelectedState(selectedIds))
    }, [selectedIds?.length])
    */

    const getHiddenState = () => {
        const visibleColumns = {};
        columns.forEach(column => {
            visibleColumns[column.id] = !(column?.hidden);
        });

        return visibleColumns
    }



    const table = useReactTable({
        data,
        getRowId: (originalRow, index, parent) => originalRow?.[id] ?? index,
        columns : (canSelect ? [selectColumn, ...columns] : columns),
        defaultColumn: {
            cell: EditableCell
        },
        enableRowSelection: true,
        state: {
            rowSelection,
            columnFilters,
            sorting,
        },
        initialState: {
            columnVisibility: getHiddenState()
        },

        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        enableHiding: true,
        enableFilters: canFilter,
        enableExpanding: canExpand,
        enableSorting: canSort,
        enableSortingRemoval: true,
        enableMultiSort: true,
        maxMultiSortColCount: 3,
        isMultiSortEvent: () => true,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip age index reset until after next rerender
                skipAutoResetPageIndex()
                onCellEdit(rowIndex, columnId, value)
            },
        },
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
                    {table.getRowModel().rows.map(row => {
                        return (
                            <>
                                <tr key={row.id} {...customRowProps(row)} onClick={() => onRowClick(row.id)} style={rowStyle(row.id)}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                    )}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent({ row })}
                                        </td>
                                    </tr>
                                )}
                            </>
                        )
                    })}
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
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip]
}