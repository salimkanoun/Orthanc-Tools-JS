import React, { useMemo } from "react";

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ data }) => {

    const row = useMemo(() => data, [data])

    const columns = [
        {
            id: 'ID',
            accessorKey: 'ID',
            header: 'ID',
            cell: row => <i>{row.getValue()}</i>,
            enableHiding: true,
        },
        {
            id: 'ErrorCode',
            accessorKey: 'ErrorCode',
            header: "ErrorCode",
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'ErrorDescription',
            accessorKey: 'ErrorDescription',
            header: "ErrorDescription",
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'Priority',
            accessorKey: 'Priority',
            header: "Priority",
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'Type',
            accessorKey: 'Type',
            header: "Type",
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'EffectiveRuntime',
            accessorKey: 'EffectiveRuntime',
            header: "EffectiveRuntime",
            cell: row => <i>{row.getValue()}</i>
        },
        {
            id: 'Content',
            accessorKey: 'Content',
            header: "Details",
            cell: ({ row }) => {
                return (
                    <div style={{ maxWidth: '300px' }}>
                        <pre >
                            {JSON.stringify(row.original.Content, null, 2)}
                        </pre>
                    </div>
                )
            }
        }
    ]

    return (<CommonTableV8 columns={columns} data={row} />);

}