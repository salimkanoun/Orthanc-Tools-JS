import React, {useMemo} from 'react'
import CommonTable from "../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function TableImportError({data, ...props}) {

    const columns = [{
        accessor: 'fileID',
        hidden: true
    }, {
        accessor: 'filename',
        Header: 'FileName',
        sort: true,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'error',
        Header: 'Error Message',
        sort: true,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }]

    const rows = useMemo(() => data, [data]);

    return (
        <CommonTable columns={columns} tableData={rows} {...props}/>
    )


}