import React, {Fragment, useMemo} from "react";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function FtpEndpoints({endpointsData, onDeleteEndpoint}) {

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
            accessor: 'ssl',
            Header: 'Sử dụng ssl?',
            Cell: ({row}) => <p>{(row.values.ssl ? '✓' : '✖')}</p>
        },
        {
            dataField: 'delete',
            Header: 'Xóa endpoint',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            await onDeleteEndpoint(row.values.id)
                        }} value="Xóa"/>
                    </div>)
            },
            formatExtraData: this
        }], [onDeleteEndpoint]);

    return (
        <Fragment>
            <h2 className="card-title mt-5">Endpoints xuất FTP/FTPS</h2>
            <CommonTable tableData={endpointsData} columns={columns}/>
        </Fragment>
    )
}

