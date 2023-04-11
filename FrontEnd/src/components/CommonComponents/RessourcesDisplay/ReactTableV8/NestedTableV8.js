import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
} from '@tanstack/react-table'
import CommonTableV8 from "./CommonTableV8";

export default ({ columnsTable,  data, renderSubComponent }) => {
    //renderSubData : fonction qui à partir d'une row, renvoie les données à nester

    const columns = [
        {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <button
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: 'pointer' },
                        }}
                    >
                        {row.getIsExpanded() ? '⬇' : '➡'}
                    </button>
                ) : (
                    ''
                )
            },
        },
    ]

    const columnsConcat = [].concat(columns, columnsTable);

    const table = useReactTable({
        data,
        columns : columnsConcat,
        //getRowCanExpand ,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div className="p-2">
            <div className="h-2" />
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <div>
                                <tr>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        {/* 2nd row is a custom 1 cell row */}
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent({row})}
                                        </td>
                                    </tr>
                                )}
                            </div>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div>{table.getRowModel().rows.length} Rows</div>
        </div>
    )
}