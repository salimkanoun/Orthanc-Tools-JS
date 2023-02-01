import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    Row,
  } from '@tanstack/react-table'
import CommonTableV8 from "./CommonTableV8";

export default ({columnsTable, columnsNested, data}) => {

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
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )
            },
          },
    ]

    const columnsConcat = concat(columns, columnsTable);

    const table = useReactTable({
        data,
        columns,
        getRowCanExpand,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
      })

      

}