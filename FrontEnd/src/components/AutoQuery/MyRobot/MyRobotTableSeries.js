import React, { useMemo } from 'react'
import { Button, Dropdown } from 'react-bootstrap';

import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';
import OhifLink from '../../Viewers/OhifLink';
import StoneLink from '../../Viewers/StoneLink';

import { ReactComponent as CheckedSVG } from '../../../assets/images/check-circle.svg'
import { ReactComponent as XSVG } from '../../../assets/images/x-circle.svg'
import { ReactComponent as PendingSVG } from '../../../assets/images/pending.svg'
import { ReactComponent as RepeatSVG } from '../../../assets/images/arrow-repeat.svg'
import { ITEM_SUCCESS } from './MyRobotRoot';

export default ({ rows = [], selectedRowsIds, onSelectRow, onRetryItem, onDeleteItem }) => {

    const columns = [{
        accessorKey: 'id',
        enableHiding: true
    },
    {
        accessorKey: 'Level',
        header: 'Level'
    },
    {
        accessorKey: 'PatientName',
        header: 'Patient Name'
    }, {
        accessorKey: 'PatientID',
        header: 'Patient ID'
    }, {
        accessorKey: 'AccessionNumber',
        header: 'Accession Number'
    }, {
        accessorKey: 'StudyDate',
        header: 'Study Date'
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description'
    }, {
        accessorKey: 'SeriesDescription',
        header: 'Series Description'
    }, {
        accessorKey: 'OriginAET',
        header: 'AET',
    },
    {
        accessorKey: 'Validated',
        header: 'Validated',
        cell: ({ getValue }) => {
            let value = getValue()
            if (value == null) return <div className="text-center"><PendingSVG /></div>
            return value === true ? <div className="text-center"><CheckedSVG /></div> :
                <div className="text-center"><XSVG /></div>
        },
    },
    {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row, getValue }) => {
            const value = getValue()
            return (
                <div className={'d-flex'}>
                    <p>{value}</p>
                    {value === 'failed' ?
                        <Button type={"button"}
                            onClick={() => onRetryItem(row.original.AnswerId)}>
                            <RepeatSVG />
                        </Button>
                        :
                        null}
                </div>
            )
        }
    },
    {
        accessorKey: 'Remove',
        header: 'Remove Query',
        cell: ({ row }) => {
            return row.original.approved === false ?
                (
                    <Button className='otjs-button otjs-button-red'
                        onClick={() => onDeleteItem(row.original.AnswerId)} >
                        Remove
                    </Button>
                )
                : null
        }
    },
    {
        accessorKey: 'Viewers',
        header: 'Viewers',
        cell: ({ row }) => {
            return row.original.Status === ITEM_SUCCESS ?
                <>
                    <Dropdown drop='left'>
                        <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic"
                            className="button-dropdown button-dropdown-green">
                            Viewers
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <OhifLink className='dropdown-item bg-green'
                                StudyInstanceUID={row.original.StudyInstanceUID} />
                            <StoneLink className='dropdown-item bg-green'
                                StudyInstanceUID={row.original.StudyInstanceUID} />
                        </Dropdown.Menu>
                    </Dropdown>
                </>
                : null
        }
    }, {
        accessorKey: 'RetrievedOrthancId',
        enableHiding: true
    }];

    const onSelectRowHandler = (rowIds) => {
        let selectedRows = rows.filter(row => rowIds.includes(row.id))
        let retrievedOrthancIds = []
        for (const row of selectedRows) {
            if (row?.RetrievedOrthancId) {
                retrievedOrthancIds.push(row.RetrievedOrthancId)
            }
        }
        onSelectRow(retrievedOrthancIds)
    }


    const selectedRowKey = useMemo(() => {
        let selectedRows = rows.filter((row) => selectedRowsIds.includes(row.RetrievedOrthancId))
        return selectedRows.map(selectedRow => selectedRow.id)
    }, [selectedRowsIds.length])

    return (
        <>
            <CommonTableV8 id={'id'} canSelect={false} selectedRowsIds={selectedRowKey} columns={columns} data={rows} onSelectRow={onSelectRowHandler} paginated />
        </>
    )
}