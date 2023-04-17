import React from 'react'
import CommonTableV8 from '../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

export default ({ data }) => {

    const columns = [
        {
            accessorKey: 'fileID',
            header: 'File',
            hidden: true
        }, {
            accessorKey: 'filename',
            header: 'FileName',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        }, {
            accessorKey: 'error',
            header: 'Error Message',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        }
    ]

    return (
        <CommonTableV8 columns={columns} data={data} canSort paginated />
    )
}