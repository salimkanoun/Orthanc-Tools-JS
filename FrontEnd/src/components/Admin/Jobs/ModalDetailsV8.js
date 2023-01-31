    import React, { useMemo, useState } from "react";

    export default ({ show, ohHide, data}) => {

        const row = useMemo(() => data, [data])

        const columns = [
            {
                id: 'ID',
                accessorKey: 'ID',
                show : false,
                header: () => <span>ID</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'ErrorCode',
                accessorKey: 'ErrorCode',
                header: () => <span>ErrorCode</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'ErrorDescription',
                accessorKey: 'ErrorDescription',
                header: () => <span>ErrorDescription</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Priority',
                accessorKey: 'Priority',
                header: () => <span>Priority</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Type',
                accessorKey: 'Type' ,
                header: () => <span>Type</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'EffectiveRuntime',
                accessorKey: 'EffectiveRuntime',
                header: () => <span>EffectiveRuntime</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Content',
                accessorKey: 'Content',
                header: () => <span>Details</span>,
                cell:  ({row}) => {
                    return (
                        <pre>
                            {JSON.stringify(row.values.Content, null, 2)}
                        </pre>
                    )
                }
            }

        ]
    }