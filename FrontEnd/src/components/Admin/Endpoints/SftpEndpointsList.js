import React, { Fragment, useMemo } from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ endpointsData, onDeleteEndpoint }) => {

    const data = useMemo(() => endpointsData, [endpointsData]);

    const columns = [
        {
            id :'label',
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
            id : 'sshKey',
            accessoryKey: 'sshKey',
            header: 'Ssh Private Key',
            Cell: ({ row }) => <p>{(row.sshKey ? row.sshKey.label : '✖')}</p>
        },
        {
            id  :'delete',
            accessoryKey: 'delete',
            header: 'Delete endpoint',
            Cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.id)
                        }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]



    return (
        <Fragment>
            <h2 className="card-title mt-5">SFTP Export Endpoints</h2>
            <CommonTableV8 data={data} columns={columns} />
        </Fragment>
    )
}

