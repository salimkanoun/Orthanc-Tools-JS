import React from "react";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ endpointsData, onDeleteEndpoint }) => {

    const columns = [
        {
            id: 'id',
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
            accessorkey: 'username',
            header: 'Username',
        },
        {
            id: 'targetFolder',
            accessorKey: 'targetFolder',
            header: 'Target Folder',
        },
        {
            id: 'ssl',
            accessorKey: 'ssl',
            header: 'Use ssl?',
            cell: ({ row }) => <p>{(row.values.ssl ? '✓' : '✖')}</p>
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            dataField: 'delete',
            header: 'Delete endpoint',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            let id = row.values.id
                            await onDeleteEndpoint.mutate({ id })
                        }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]

    return (
        <>
            <h2 className="card-title mt-5">FTP/FTPS Export Endpoints</h2>
            <CommonTableV8 data={endpointsData} columns={columns} />
        </>
    )
}

