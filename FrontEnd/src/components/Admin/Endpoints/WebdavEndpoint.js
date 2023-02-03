import React, { Fragment, useMemo } from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ onDeleteEndpoint, endpointsData }) => {

    const data = useMemo(() => endpointsData, [endpointsData])

    const columns = [
        {
            id : 'label',
            accessoryKey: 'label',
            header: 'Label',
            cell : (row) => {row.getValue()},
        },
        {
            id : 'host', 
            accessoryKey: 'host',
            header: 'Host',
            cell : (row) => {row.getValue()},
        },
        {
            id : 'username',
            accessoryKey: 'username',
            header: 'Username',
            cell : (row) => {row.getValue()},
        },
        {
            id : 'targetFolder',
            accessoryKey: 'targetFolder',
            header: 'Target Folder',
            cell : (row) => {row.getValue()},
        },
        {
            id  : 'digest', 
            accessoryKey: 'digest',
            header: 'Use Digest?',
            Cell: ({ row }) => <p>{(row.values.digest ? '✓' : '✖')}</p>
        },
        {
            id : 'delete',
            accessoryKey: 'delete',
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

