import React, { Fragment, useMemo } from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ onDeleteEndpoint, endpointsData }) => {

    const data = useMemo(() => endpointsData, [endpointsData])

    const columns = [
        {
            id : 'label',
            accessorKey: 'label',
            header: 'Label',
        },
        {
            id : 'host', 
            accessorKey: 'host',
            header: 'Host',
        },
        {
            id : 'username',
            accessorKey: 'username',
            header: 'Username',
        },
        {
            id : 'targetFolder',
            accessorKey: 'targetFolder',
            header: 'Target Folder',
        },
        {
            id  : 'digest', 
            accessorKey: 'digest',
            header: 'Use Digest?',
            Cell: ({ row }) => <p>{(row.values.digest ? '✓' : '✖')}</p>
        },
        {
            id : 'delete',
            accessorKey: 'delete',
            header: 'Delete endpoint',
            Cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Remove" />
                    </div>)
            }
        }
    ]


    return (
        <Fragment>
            <h2 className="mt-5 card-title">Webdav Export Endpoints</h2>
            <CommonTableV8 columns={columns} data={data} />
        </Fragment>
    )
}

