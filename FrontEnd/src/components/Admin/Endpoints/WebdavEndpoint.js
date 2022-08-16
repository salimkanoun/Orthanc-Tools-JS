import React, {Fragment, useMemo} from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function WebdavEndpoints({onDeleteEndpoint, endpointsData}) {

    const columns = useMemo(() => [{
        accessor: 'label',
        Header: 'Nhãn'
    },
        {
            accessor: 'host',
            Header: 'Máy chủ'
        },
        {
            accessor: 'username',
            Header: 'Username'
        },
        {
            accessor: 'targetFolder',
            Header: 'Thư mục đích'
        },
        {
            accessor: 'digest',
            Header: 'Sử dụng Digest?',
            Cell: ({row}) => <p>{(row.values.digest ? '✓' : '✖')}</p>
        },
        {
            accessor: 'delete',
            Header: 'Xóa endpoint',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Xóa"/>
                    </div>)
            }
        }], [onDeleteEndpoint]);

    const data = useMemo(() => endpointsData, [endpointsData])

    return (
        <Fragment>
            <h2 className="mt-5 card-title">Endpoints xuất Webdav</h2>
            <CommonTable columns={columns} tableData={data}/>
        </Fragment>
    )
}

