import React, { useMemo } from 'react'
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
        if(value instanceof Date) value = moment(value).format('YYYYMMDD')
        dispatch(editCellQuery(rowIndex, columnId, value));
    }

    const rowStyle = (queryKey) => {
        if (queryKey === currentRow) return { background: 'peachPuff' }
    }

    const columns = useMemo(() => [{
        id: 'key',
        accessorKey: 'key',
        enableHiding: true
    }, {
        accessorKey: 'PatientName',
        header: 'Patient Name',
        isEditable: true
    }, {
        accessorKey: 'PatientID',
        header: 'Patient ID',
        isEditable: true
    }, {
        accessorKey: 'AccessionNumber',
        header: 'Accession Number',
        isEditable: true
    }, {
        accessorFn : (row) => {
            if(row.DateFrom == "" || row.DateFrom ==null) return null
            return moment(row.DateFrom, 'YYYYMMDD', true)?.toDate()
        },
        id: 'DateFrom',
        header: 'Date From',
        isEditable: true,
        editionProperties: {
            type: 'CALENDAR'
        },
        filterType: filter.DATE_FILTER,
        filterFn: isWithinDateRange
    }, {
        accessorFn : (row) => {
            if(row.DateTo == "" || row.DateTo ==null) return null
            return moment(row.DateTo, 'YYYYMMDD', true)?.toDate()
        },
        id: 'DateTo',
        header: 'Date To',
        isEditable: true,
        editionProperties: {
            type: 'CALENDAR'
        },
        filterType: filter.DATE_FILTER,
        filterFn: isWithinDateRange
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description',
        isEditable: true
    }, {
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
        cell: ({ row, getValue }) => {
            return <SelectModalities
                previousModalities={getValue()}
                onChange={(value) => cellEditHandler(row.original.key, 'ModalitiesInStudy', value)}
            />
        }
    }, {
        accessorKey: 'Aet',
        header: 'AET',
        isEditable: true,
        editionProperties: {
            type: 'SELECT',
            options: aets.map(aet => ({ value: aet, label: aet }))
        }
    }], []);

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