import React, { useMemo } from "react";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ onDeleteEndpoint, endpointsData }) => {

    const data = useMemo(() => endpointsData, [endpointsData])

    const columns = [
        {
            id: 'label',
            accessorKey: 'label',
            header: 'Label',
        },
        {
            id: 'host',
            accessorKey: 'host',
            header: 'Host',
        },
        {
            id: 'username',
            accessorKey: 'username',
            header: 'Username',
        },
        {
            id: 'targetFolder',
            accessorKey: 'targetFolder',
            header: 'Target Folder',
        },
        {
            id: 'digest',
            accessorKey: 'digest',
            header: 'Use Digest?',
            cell: ({ row }) => <p>{(row.values.digest ? '✓' : '✖')}</p>
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            header: 'Delete endpoint',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            let id = row.values.id
                            await onDeleteEndpoint.mutate(id)
                        }} value="Remove" />
                    </div>)
            }
        }
    ]


    return (
        <>
            <h2 className="mt-5 card-title">Webdav Export Endpoints</h2>
            <CommonTableV8 columns={columns} data={data} />
        </>
    )
}

