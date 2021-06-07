import React, { Component } from 'react'
import { connect } from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, dateFilter, selectFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import AnonExportDeleteSendButton from '../../Import/AnonExportDeleteSendButton'
import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'
import apis from '../../../services/apis'

import { ReactComponent as CheckedSVG } from '../../../assets/images/check-circle.svg'
import { ReactComponent as XSVG } from '../../../assets/images/x-circle.svg'
import { ReactComponent as PendingSVG } from '../../../assets/images/pending.svg'

import { addStudiesToExportList } from '../../../actions/ExportList'
import { addStudiesToDeleteList } from '../../../actions/DeleteList'
import { addStudiesToAnonList } from '../../../actions/AnonList'

import MonitorTask from '../../../tools/MonitorTask'
import { toast } from 'react-toastify';
import { Fragment } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown'


/**
 * View page of a sigle Retrieve Robot content
 * With progress monitoring and delete item action
 */
class RobotView extends Component {

    state = {
        id : null,
        valid: null,
        approved: null,
        rows: [],
        totalPercentageProgress: 0,
        percentageFailure: 0
    }

    componentDidMount = () => {
        this.startProgressMonitoring()
    }

    componentWillUnmount = () => {
        this.stopProgressMonitoring()
    }

    columns = [{
        dataField: 'id',
        hidden: true
    }, {
        dataField: 'Level',
        text: 'level',
        filter: selectFilter({
            options: { study: 'study', series: 'series' }
        })
    }, {
        dataField: 'StudyInstanceUID',
        hidden: true
    }, {
        dataField: 'PatientName',
        text: 'Patient Name',
        filter: textFilter(),
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'PatientID',
        text: 'Patient ID',
        filter: textFilter(),
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'StudyDate',
        text: 'Study Date',
        filter: dateFilter()
    }, {
        dataField: 'Modality',
        text: 'Modality',
        filter: textFilter()
    }, {
        dataField: 'StudyDescription',
        text: 'Study Description',
        filter: textFilter(),
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'SeriesDescription',
        text: 'Series Description',
        filter: textFilter(),
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'AccessionNumber',
        text: 'Accession Number',
        filter: textFilter()
    }, {
        dataField: 'OriginAET',
        text: 'AET',
        filter: textFilter()
    }, {
        dataField: 'Validated',
        text: 'Validated',
        filter: textFilter(),
        formatter: (cell, row, rowIndex, formatExtraData) => {
            if (cell == null) return <div className="text-center"><PendingSVG /></div>
            return cell === true ? <div className="text-center"><CheckedSVG /></div> : <div className="text-center"><XSVG /></div>
        }
    }, {
        dataField: 'Status',
        text: 'Status',
        filter: textFilter(),
        style: function callback(cell, row, rowIndex, colIndex) {
            if (cell === 'Success') {
                return ({ backgroundColor: 'green' })
            } else if (cell === 'Failure') {
                return ({ backgroundColor: 'red' })
            }
        }
    }, {
        dataField: 'Remove',
        text: 'Remove Query',
        formatter: (cell, row, rowIndex, formatExtraData) => {
            return this.state.approved === false ?
                (<div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={() => formatExtraData.deleteQueryHandler(rowIndex, formatExtraData.refreshHandler)} value="Remove" />
                </div>)
                : null
        },
        formatExtraData: this
    }, {
        dataField: 'Viewers',
        text: 'Viewers',
        formatter: function (cell, row, rowIndex, formatExtraData) {
            return row.Status === RobotView.ITEM_SUCCESS ?
                <Fragment>
                    <Dropdown onClick={this.handleClick} drop='left'>
                        <Dropdown.Toggle variant="success" id="dropdown-basic"  >
                            Viewers
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <OhifLink className='dropdown-item bg-info' StudyInstanceUID={row.StudyInstanceUID} />
                            <StoneLink className='dropdown-item bg-info' StudyInstanceUID={row.StudyInstanceUID} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Fragment>
                : null
        }
    }, {
        dataField: 'RetrievedOrthancId',
        hidden: true
    }]



    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            if (row.Status !== RobotView.ITEM_SUCCESS) {
                return false
            } else {
                return true
            }
        },
        onSelectAll: (isSelect, rows, e) => {
            if( ! isSelect) return []
            let rowsToSelect = rows.map(row => {
                if (row.Status === RobotView.ITEM_SUCCESS) {
                    return row.id
                }else{
                    return false
                }
            })
            return rowsToSelect;
        }

    }

    getSelectedItemsStudiesDetails = async () => {

        //get selected row keys
        let selectedIdRow = this.node.selectionContext.selected
        //get array of selected rows
        let seletectedRows = this.state.rows.filter(row => {
            if (selectedIdRow.includes(row.id)) return true
            else return false
        })

        let studyDataRetrieved = []
        //Loop each item to retrieve study level
        for (let row of seletectedRows) {
            let studyDetails
            if (row.Level === 'study') {
                studyDetails = await apis.content.getStudiesDetails(row.RetrievedOrthancId)
            } else {
                let seriesData = await apis.content.getSeriesDetailsByID(row.RetrievedOrthancId)
                studyDetails = await apis.content.getStudiesDetails(seriesData.ParentStudy)
            }
            studyDataRetrieved.push(studyDetails)
        }

        return studyDataRetrieved

    }

    sendToAnon = async () => {
        let studyArray = await this.getSelectedItemsStudiesDetails()
        this.props.addStudiesToAnonList(studyArray)
    }

    sendToExport = async () => {
        let studyArray = await this.getSelectedItemsStudiesDetails()
        this.props.addStudiesToExportList(studyArray)
    }

    sendToDelete = async () => {
        let studyArray = await this.getSelectedItemsStudiesDetails()
        this.props.addStudiesToDeleteList(studyArray)
    }

    startProgressMonitoring = async () => {
        let response = await apis.task.getTask(this.props.id);
        this.setState({
            id:response.id,
            creator:response.creator
        });
        this.task = new MonitorTask(this.props.id);
        this.task.onUpdate(this.refreshHandler.bind(this));
        this.task.startMonitoringJob();
        this.refreshHandler(response);
    }

    stopProgressMonitoring = () => {
        if (this.task !== undefined) this.task.stopMonitoringJob();
    }

    refreshHandler = (response) => {
        if (!response) {
            this.setState({
                valid: null,
                approved: null,
                projectName: '',
                rows: [],
                totalPercentageProgress: 0,
                percentageFailure: 0
            })
            this.stopProgressMonitoring()
            return;
        }

        let rowsRetrieveList = []

        let newPercentageFailure = 0

        response.details.items.forEach(item => {

            rowsRetrieveList.push({
                //Merge Modalities (study level) to modality column
                Modality: item.ModalitiesInStudy,
                id: item.AnswerNumber + ":" + item.AnswerId,
                ...item
            })

            if (item.Status === RobotView.ITEM_FAILED) {
                ++newPercentageFailure;
            }
        });


        //SK CALCULER EN INSTANCE ET PAS EN STUDY (1 si pas d'info)
        newPercentageFailure = (newPercentageFailure / response.details.items.length) * 100

        let newTotalPercentageProgress = Math.round((response.progress.retrieve + Number.EPSILON) * 10) / 10
        
        this.setState({
            valid: response.details.valid,
            approved: response.details.approved,
            projectName: response.details.projectName,
            rows: rowsRetrieveList,
            totalPercentageProgress: newTotalPercentageProgress,
            percentageFailure: newPercentageFailure
        })
    }

    deleteQueryHandler = async (rowIndex, refreshHandler) => {

        try {
            let row = this.state.rows[rowIndex];
            await apis.retrieveRobot.deleteRobotItem(this.state.id, row.id)

            if (this.state.rows.length <= 1) {
                this.setState({
                    ...this.state,
                    rows: [],
                    id:null
                })
                this.task.stopMonitoringJob();
            } else {
                apis.task.getTask(this.state.id).then(this.refreshHandler)
            }
        } catch (error) {
            toast.error(error)
        }

    }

    handleClickDeleteRobot = async () => {
        await apis.retrieveRobot.deleteRobot(this.state.id);
        await this.refreshHandler(null);
        await this.setState({
            id:null
        })
    }

    render = () => {
        return (
            <div className="jumbotron">
                <div className="row mb-5">
                    <h1 className="col"> Robot for user {this.state.creator}, project : {this.state.projectName} </h1>
                    <div className="col-md-2 text-right" >
                        <CircularProgressbarWithChildren
                            value={this.state.totalPercentageProgress} text={`Progress : ${this.state.totalPercentageProgress}%`}
                            styles={buildStyles({
                                textSize: '10px'
                            })}
                        >
                            {/* Foreground path */}
                            <CircularProgressbar
                                value={this.state.percentageFailure}
                                styles={buildStyles({
                                    trailColor: "transparent",
                                    pathColor: "#f00"
                                })}
                            />
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
                <input type='button' className="btn btn-danger" onClick={this.handleClickDeleteRobot} value="Delete Robot" />
                <BootstrapTable ref={n => this.node = n} wrapperClasses="table-responsive" keyField="id" striped={true} rowClasses={this.rowClasses} selectRow={this.selectRow} filter={filterFactory()} pagination={paginationFactory()} data={this.state.rows} columns={this.columns} />
                <AnonExportDeleteSendButton onAnonClick={this.sendToAnon} onExportClick={this.sendToExport} onDeleteClick={this.sendToDelete} />
            </div>
        )
    }
}

const mapDispatchToProps = {
    addStudiesToExportList,
    addStudiesToDeleteList,
    addStudiesToAnonList

}

RobotView.ITEM_SUCCESS = 'completed'
RobotView.ITEM_AWAITING = 'wait'
RobotView.ITEM_PENDING = 'active'
RobotView.ITEM_FAILED = 'failed'
RobotView.ITEM_DELAYED = 'delayed'

RobotView.ROBOT_WAITING_VALIDATION = 'waiting validation'
RobotView.ROBOT_VALIDATING = 'validation'
RobotView.ROBOT_WAITING_RETRIEVE = 'waiting retireve'
RobotView.ROBOT_RETRIEVING = 'retrieve'
RobotView.ROBOT_COMPLETED = 'completed'

export default connect(null, mapDispatchToProps)(RobotView)