import React from 'react'
import { useDispatch } from 'react-redux'

import moment from 'moment'

import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities"
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"
import { editCellQuery } from '../../../actions/TableQuery'

export default ({ queries = [], onRowClick, currentRow, onSelectRowsChange, selectedRowIds }) => {

    const dispatch = useDispatch()

    const selectRowHandle = (rowIds) => {
        onSelectRowsChange(rowIds)
    }

    const cellEditHandler = (rowIndex, columnId, value) => {
        dispatch(editCellQuery(rowIndex, columnId, value));
    }

    const rowStyle = (queryKey) => {
        if (queryKey === currentRow) return { background: 'peachPuff' }
    }

    const columns = [{
        id: 'key',
        accessorKey: 'key',
        enableHiding: true
    }, {
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        isEditable: true
    }, {
        accessorKey: 'SeriesInstanceUID',
        header: 'SeriesInstanceUID',
        isEditable: true
    }]

    return (
        <CommonTableV8
            id='key'
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