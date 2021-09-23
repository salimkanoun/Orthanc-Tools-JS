import React, {Fragment, useMemo} from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function FtpEndpoints({endpointsData, onDeleteEndpoint}) {

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
            accessor: 'ssl',
            Header: 'Use ssl?',
            Cell: ({row}) => <p>{(row.values.ssl ? '✓' : '✖')}</p>
        },
        {
            dataField: 'delete',
            Header: 'Delete endpoint',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Remove"/>
                    </div>)
            },
            formatExtraData: this
        }], [onDeleteEndpoint]);

    return (
        <Fragment>
            <h2 className="card-title mt-5">FTP/FTPS Export Endpoints</h2>
            <CommonTable tableData={endpointsData} columns={columns}/>
        </Fragment>
    )
}

