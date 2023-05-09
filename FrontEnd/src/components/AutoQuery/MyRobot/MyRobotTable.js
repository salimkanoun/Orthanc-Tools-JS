import React from 'react'
import { Button, Dropdown } from 'react-bootstrap';

import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';
import OhifLink from '../../Viewers/OhifLink';
import StoneLink from '../../Viewers/StoneLink';

import { ReactComponent as CheckedSVG } from '../../../assets/images/check-circle.svg'
import { ReactComponent as XSVG } from '../../../assets/images/x-circle.svg'
import { ReactComponent as PendingSVG } from '../../../assets/images/pending.svg'
import { ReactComponent as RepeatSVG } from '../../../assets/images/arrow-repeat.svg'

import apis from '../../../services/apis';
import { errorMessage } from '../../../tools/toastify';

export default ({ robotId, rows }) => {

    //SK ICI CHECKER LE ITEMID dans le backend (eviter position et remplacer par un ID (actuelement aswerId mais mauvaise idee car existe qu'une fois executee))
    const retryQueryHandler = async (itemId) => {
        try {
            await apis.retrieveRobot.deleteRobotItem(robotId, itemId)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Delete Failed')
        }
    }

    const deleteQueryHandler = async (itemId) => {
        try {
            await apis.retrieveRobot.retryRobotItem(robotId, itemId)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Retry Failed')
        }
    }

    const columns = [{
        accessorKey: 'key',
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
        accessorKey: 'DateFrom',
        header: 'Date From'
    }, {
        accessorKey: 'DateTo',
        header: 'Date To'
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description'
    }, {
        accessorKey: 'SeriesDescription',
        header: 'Series Description'
    },
    {
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
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
                            onClick={() => retryQueryHandler(row.original.AnswerId)}>
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
                        onClick={() => deleteQueryHandler(row.original.AnswerId)} >
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
            return row.original.Status === 'Success' ?
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

    return (
        <>
            <CommonTableV8 columns={columns} data={rows} paginated />
        </>
    )
}