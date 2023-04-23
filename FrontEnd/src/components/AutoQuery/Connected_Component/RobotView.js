import React, { Component, Fragment, useMemo } from 'react'
import { connect } from "react-redux"
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';


import Dropdown from 'react-bootstrap/esm/Dropdown'

import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'
import apis from '../../../services/apis'

import { ReactComponent as CheckedSVG } from '../../../assets/images/check-circle.svg'
import { ReactComponent as XSVG } from '../../../assets/images/x-circle.svg'
import { ReactComponent as PendingSVG } from '../../../assets/images/pending.svg'
import { ReactComponent as RepeatSVG } from '../../../assets/images/arrow-repeat.svg'


import {
    dateFilter,
    DateFilter,
    InputFilter,
    selectFilter,
    SelectFilter
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFilters";
import CommonSelectingAndFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingAndFilteringTable";
import { Button } from "react-bootstrap";


function RobotTable({ rows, approved, refreshHandler, deleteQueryHandler, retryQueryHandler, onSelect }) {
    const columns = useMemo(() => [{
        accessor: 'id',
        show: false
    }, {
        accessor: 'Level',
        Header: 'Level',
        Filter: SelectFilter('Level', [{ value: 'study', label: 'Study' }, { value: 'series', label: 'Series' }]),
        filter: selectFilter
    }, {
        accessor: 'StudyInstanceUID',
        show: false
    }, {
        accessor: 'PatientName',
        Header: 'Patient Name',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        Filter: InputFilter('Patient Name')
    }, {
        accessor: 'PatientID',
        Header: 'Patient ID',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        Filter: InputFilter('Patient ID')
    }, {
        accessor: 'StudyDate',
        Header: 'Study Date',
        Filter: DateFilter('Study Date'),
        filter: dateFilter
    }, {
        accessor: 'Modality',
        Header: 'Modality',
        Filter: InputFilter('Modality')
    }, {
        accessor: 'StudyDescription',
        Header: 'Study Description',
        style: {
            whiteSpace: 'normal', wordWrap:
                'break-word'
        },
        Filter: InputFilter('Study Description')
    }, {
        accessor: 'SeriesDescription',
        Header: 'Series Description',
        style: {
            whiteSpace: 'normal', wordWrap:
                'break-word'
        }
        ,
        Filter: InputFilter('Study Description')
    }, {
        accessor: 'AccessionNumber',
        Header: 'Accession Number',
        Filter: InputFilter('Accession Number')
    }, {
        accessor: 'OriginAET',
        Header: 'AET',
        Filter: InputFilter('AET')
    }, {
        accessor: 'Validated',
        Header: 'Validated',
        Cell: ({ value, row }) => {
            if (value == null) return <div className="text-center"><PendingSVG /></div>
            return value === true ? <div className="text-center"><CheckedSVG /></div> :
                <div className="text-center"><XSVG /></div>
        },
        Filter: SelectFilter('Validated', [
            { value: true, label: 'Validated' },
            { value: false, label: 'Invalid' },
            { value: null, label: 'Unvalidated' }
        ]),
        filter: selectFilter
    }, {
        accessor: 'Status',
        Header: 'Status',
        style: function callback({ row }) {
            if (row.values.Status === 'completed') {
                return ({ backgroundColor: 'green' })
            } else if (row.values.Status === 'failed') {
                return ({ backgroundColor: 'red' })
            }
        },
        Filter: SelectFilter('Status', [
            { value: 'completed', label: 'Completed' },
            { value: 'paused', label: 'Paused' },
            { value: 'failed', label: 'Failed' },
            { value: 'waiting', label: 'Waiting' },
            { value: 'validating', label: 'Validating' }
        ]),
        filter: selectFilter,
        Cell: ({ row: { index }, value }) => <div className={'d-flex'}>
            <p>{value}</p>
            {value === 'failed' ?
                <Button type={"button"} onClick={() => retryQueryHandler(index)}><RepeatSVG /></Button> : null}
        </div>
    }, {
        id: 'Remove',
        Header: 'Remove Query',
        Cell:
            ({ row: { index } }) => {
                return approved === false ?
                    (<div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red'
                            onClick={() => deleteQueryHandler(index)}
                            value="Remove" />
                    </div>)
                    : null
            },
        disableFilters:
            true,
    }, {
        id: 'Viewers',
        Header: 'Viewers',
        Cell:
            ({ row: { values } }) => {
                return values.Status === 'Success' ?
                    <Fragment>
                        <Dropdown drop='left'>
                            <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic"
                                className="button-dropdown button-dropdown-green">
                                Viewers
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <OhifLink className='dropdown-item bg-green'
                                    StudyInstanceUID={values.StudyInstanceUID} />
                                <StoneLink className='dropdown-item bg-green'
                                    StudyInstanceUID={values.StudyInstanceUID} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Fragment>
                    : null
            },
        disableFilters: true,
    }, {
        accessor: 'RetrievedOrthancId',
        show: false
    }
    ], [approved, refreshHandler, deleteQueryHandler]);
    const data = useMemo(() => rows, [rows]);
    return <CommonSelectingAndFilteringTable tableData={data} columns={columns}
        onSelect={value => onSelect(value.map(v => v.values))}
        skipAutoRefresh={true} />
}

export default RobotTable