import React, { useMemo, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap';

import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';
import OhifLink from '../../Viewers/OhifLink';
import StoneLink from '../../Viewers/StoneLink';

import { ReactComponent as CheckedSVG } from '../../../assets/images/check-circle.svg'
import { ReactComponent as XSVG } from '../../../assets/images/x-circle.svg'
import { ReactComponent as PendingSVG } from '../../../assets/images/pending.svg'
import { ReactComponent as RepeatSVG } from '../../../assets/images/arrow-repeat.svg'
import { ITEM_SUCCESS } from './MyRobotRoot';

export default ({ rows = [], onSelectRow, onRetryItem, onDeleteItem }) => {

    const [selectedRowsIds, setSelectedRowsIds] = useState([])

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
        header: 'Status'
    },
    {
        accessorKey: 'Actions',
        header: 'Actions',
        cell: ({ row }) => {
            const status = row.original.Status
            return (
                <>
                    <Button
                        disabled={status !== 'failed'}
                        onClick={() => onRetryItem(row.original.id)}>
                        <RepeatSVG />
                    </Button>
                    <Button
                        className='otjs-button otjs-button-red'
                        disabled={status !== 'waiting'}
                        onClick={() => onDeleteItem(row.original.id)} >
                        Remove
                    </Button>
                </>
            )
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
        setSelectedRowsIds(retrievedOrthancIds)
    }


    const selectedRowKey = useMemo(() => {
        let selectedRows = rows.filter((row) => selectedRowsIds.includes(row.RetrievedOrthancId))
        return selectedRows.map(selectedRow => selectedRow.id)
    }, [selectedRowsIds.length])

    return (
        <>
            <CommonTableV8 id={'id'} canSelect={false} canSort selectedRowsIds={selectedRowKey} columns={columns} data={rows} onSelectRow={onSelectRowHandler} paginated />
        </>
    )
}