import React, {Fragment, useMemo} from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function WebdavEndpoints({onDeleteEndpoint, endpointsData}) {

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
            accessor: 'digest',
            Header: 'Use Digest?',
            Cell: ({row}) => <p>{(row.values.digest ? '✓' : '✖')}</p>
        },
        {
            accessor: 'delete',
            Header: 'Delete endpoint',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Remove"/>
                    </div>)
            }
        }], [onDeleteEndpoint]);

    const data = useMemo(() => endpointsData, [endpointsData])

    return (
        <Fragment>
            <h2 className="mt-5 card-title">Webdav Export Endpoints</h2>
            <CommonTable columns={columns} tableData={data}/>
        </Fragment>
    )
}

