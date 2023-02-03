import React, { Fragment, useMemo } from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ endpointsData, onDeleteEndpoint }) => {

    const columns = [
        {
            id : 'id',
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
            accessorykey: 'username',
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
            id : 'ssl',
            accessoryKey: 'ssl',
            header: 'Use ssl?',
            Cell: ({ row }) => <p>{(row.values.ssl ? '✓' : '✖')}</p>
        },
        {
            id : 'delete',
            accessorKey : 'delete',
            dataField: 'delete',
            header: 'Delete endpoint',
            Cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]

    return (
        <Fragment>
            <h2 className="card-title mt-5">FTP/FTPS Export Endpoints</h2>
            <CommonTableV8 data={endpointsData} columns={columns} />
        </Fragment>
    )
}

