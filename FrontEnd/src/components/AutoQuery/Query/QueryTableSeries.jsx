import React from 'react'
import { useDispatch } from 'react-redux'

import moment from 'moment'

import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities"
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"
import { editCellQuery } from '../../../actions/TableQuery'

import { filter } from '../../../model/Constant'
import { isWithinDateRange } from '../../CommonComponents/RessourcesDisplay/ReactTableV8/Tools/FilterFns'

export default ({ queries = [], aets = [], onRowClick, currentRow, onSelectRowsChange, selectedRowIds }) => {

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
    }, {
        accessorKey: 'Aet',
        header: 'AET',
        isEditable: true,
        editionProperties: {
            type: 'SELECT',
            options: aets.map(aet => ({ value: aet, label: aet }))
        }
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