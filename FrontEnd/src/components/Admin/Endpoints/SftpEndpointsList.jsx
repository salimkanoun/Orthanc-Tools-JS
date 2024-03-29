import React, { useMemo } from "react";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ endpointsData, onDeleteEndpoint }) => {

    const data = useMemo(() => endpointsData, [endpointsData]);

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
            id: 'sshKey',
            accessorKey: 'sshKey',
            header: 'Ssh Private Key',
            cell: ({ row }) => <p>{(row.sshKey ? row.sshKey.label : '✖')}</p>
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            header: 'Delete endpoint',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            let id = row.id
                            await onDeleteEndpoint.mutate({ id })
                        }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]



    return (
        <>
            <h2 className="card-title mt-5">SFTP Export Endpoints</h2>
            <CommonTableV8 data={data} columns={columns} />
        </>
    )
}

