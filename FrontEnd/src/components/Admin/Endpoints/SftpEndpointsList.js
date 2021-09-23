import React, {Fragment, useMemo} from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function SftpEndpoints({endpointsData, onDeleteEndpoint}) {

    const columns = useMemo(() => [{
        accessor: 'label',
        Header: 'Label'
    },
        {
            accessor: 'host',
            Header: 'Host'
        },
        {
            accessor: 'username',
            Header: 'Username'
        },
        {
            accessor: 'targetFolder',
            Header: 'Target Folder'
        },
        {
            accessor: 'sshKey',
            Header: 'Ssh Private Key',
            Cell: ({row}) => <p>{(row.sshKey ? row.sshKey.label : '✖')}</p>
        },
        {
            accessor: 'delete',
            Header: 'Delete endpoint',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.id)
                        }} value="Remove"/>
                    </div>)
            },
            formatExtraData: this
        }], [onDeleteEndpoint]);

    const data = useMemo(() => endpointsData, [endpointsData]);

    return (
        <Fragment>
            <h2 className="card-title mt-5">SFTP Export Endpoints</h2>
            <CommonTable tableData={data} columns={columns}/>
        </Fragment>
    )
}

