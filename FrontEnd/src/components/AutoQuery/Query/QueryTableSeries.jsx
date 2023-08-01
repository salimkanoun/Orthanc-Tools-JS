import React from 'react'

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"

export default ({ queries = [], aets = [], onRowClick, currentRow, onSelectRowsChange, selectedRowIds, onchange = () => { } }) => {

    const selectRowHandle = (rowIds) => {
        onSelectRowsChange(rowIds)
    }

    const cellEditHandler = (rowIndex, columnId, value) => {
        onchange(rowIndex, columnId, value)
    }

    const rowStyle = (queryKey) => {
        if (queryKey === currentRow) return { background: 'peachPuff' }
    }

    const columns = [
        {
            accessorKey: 'StudyInstanceUID',
            header: 'StudyInstanceUID'
        },
        {
            accessorKey: 'SeriesInstanceUID',
            header: 'SeriesInstanceUID'
        },
        {
            accessorKey: 'Aet',
            header: 'AET',
            isEditable: true,
            editionProperties: {
                type: 'SELECT',
                options: aets.map(aet => ({ value: aet, label: aet }))
            }
        }
    ]

    return (
        <CommonTableV8
            id='SeriesInstanceUID'
            onSelectRow={selectRowHandle}
            onRowClick={onRowClick}
            rowStyle={rowStyle}
            columns={columns}
            data={queries}
            onCellEdit={cellEditHandler}
            paginated
            canFilter
            canSelect
            selectedRowsIds={selectedRowIds}
        />
    )
}