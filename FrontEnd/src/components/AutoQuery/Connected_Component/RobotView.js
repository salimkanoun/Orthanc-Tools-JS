import React, {Component, Fragment, useMemo} from 'react'
import {connect} from "react-redux"
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import AnonExportDeleteSendButton from '../../Import/AnonExportDeleteSendButton'
import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'
import apis from '../../../services/apis'

import {ReactComponent as CheckedSVG} from '../../../assets/images/check-circle.svg'
import {ReactComponent as XSVG} from '../../../assets/images/x-circle.svg'
import {ReactComponent as PendingSVG} from '../../../assets/images/pending.svg'
import {ReactComponent as RepeatSVG} from '../../../assets/images/arrow-repeat.svg'

import {addStudiesToExportList} from '../../../actions/ExportList'
import {addStudiesToDeleteList} from '../../../actions/DeleteList'
import {addStudiesToAnonList} from '../../../actions/AnonList'

import MonitorTask from '../../../tools/MonitorTask'
import {toast} from 'react-toastify';
import Dropdown from 'react-bootstrap/esm/Dropdown'
import {
    dateFilter,
    DateFilter,
    InputFilter,
    SelectFilter
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFilters";
import CommonSelectingAndFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingAndFilteringTable";
import {Button} from "react-bootstrap";


function RobotTable({rows, approved, refreshHandler, deleteQueryHandler, retryQueryHandler, onSelect}) {
    const columns = useMemo(() => [{
        accessor: 'id',
        show: false
    }, {
        accessor: 'Level',
        Header: 'Level',
        Filter: SelectFilter('Level', [{value: 'study', label: 'Study'}, {value: 'series', label: 'Series'}])
    }, {
        accessor: 'StudyInstanceUID',
        show: false
    }, {
        accessor: 'PatientName',
        Header: 'Patient Name',
        style: {whiteSpace: 'normal', wordWrap: 'break-word'},
        Filter: InputFilter('Patient Name')
    }, {
        accessor: 'PatientID',
        Header: 'Patient ID',
        style: {whiteSpace: 'normal', wordWrap: 'break-word'},
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
        Cell: ({value, row}) => {
            if (value == null) return <div className="text-center"><PendingSVG/></div>
            return value === true ? <div className="text-center"><CheckedSVG/></div> :
                <div className="text-center"><XSVG/></div>
        },
        Filter: SelectFilter('Validated', [
            {value: true, label: 'Validated'},
            {value: false, label: 'Invalid'},
            {value: null, label: 'Unvalidated'}
        ])
    }, {
        accessor: 'Status',
        Header: 'Status',
        style: function callback({row}) {
            if (row.values.Status === 'completed') {
                return ({backgroundColor: 'green'})
            } else if (row.values.Status === 'failed') {
                return ({backgroundColor: 'red'})
            }
        },
        Filter: SelectFilter('Status', [
            {value: 'completed', label: 'Completed'},
            {value: 'paused', label: 'Paused'},
            {value: 'failed', label: 'Failed'},
            {value: 'waiting', label: 'Waiting'},
            {value: 'validating', label: 'Validating'}
        ]),
        Cell: ({row: {index}, value}) => <div className={'d-flex'}>
            <p>{value}</p>
            {value === 'failed' ?
                <Button type={"button"} onClick={() => retryQueryHandler(index)}><RepeatSVG/></Button> : null}
        </div>
    }, {
        id: 'Remove',
        Header: 'Remove Query',
        Cell:
            ({row: {index}}) => {
                return approved === false ?
                    (<div className="text-center">
                        <input type="button" className='btn btn-danger'
                               onClick={() => deleteQueryHandler(index)}
                               value="Remove"/>
                    </div>)
                    : null
            },
        disableFilters:
            true,
    }, {
        id: 'Viewers',
        Header: 'Viewers',
        Cell:
            ({row: {values}}) => {
                return values.Status === RobotView.ITEM_SUCCESS ?
                    <Fragment>
                        <Dropdown drop='left'>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Viewers
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <OhifLink className='dropdown-item bg-info'
                                          StudyInstanceUID={values.StudyInstanceUID}/>
                                <StoneLink className='dropdown-item bg-info'
                                           StudyInstanceUID={values.StudyInstanceUID}/>
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
                                             skipAutoRefresh={true}/>
}


/**
 * View page of a sigle Retrieve Robot content
 * With progress monitoring and delete item action
 */
class RobotView extends Component {

    state = {
        id: null,
        valid: null,
        approved: null,
        rows: [],
        selected: [],
        totalPercentageProgress: 0,
        percentageFailure: 0
    }

    componentDidMount = () => {
        //this.startProgressMonitoring()
        apis.task.getTask(this.props.id).then(this.refreshHandler)
    }

    componentWillUnmount = () => {
        this.stopProgressMonitoring()
    }

    getSelectedItemsStudiesDetails = async () => {

        //get array of selected rows
        let seletectedRows = this.state.selected

        let studyDataRetrieved = []
        //Loop each item to retrieve study level
        for (let row of seletectedRows) {
            await apis.content.getStudiesDetails(row.RetrievedOrthancId).then((studyDetails) => {
                studyDataRetrieved.push(studyDetails)
            }).catch((error) => {
                console.error(error)
            })
        }

        return studyDataRetrieved

    }

    setSelect = (selected) => {
        this.setState({selected});
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
            id: response.id,
            creator: response.creator
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

        let newTotalPercentageProgress = Math.round((newPercentageFailure + response.progress.retrieve + Number.EPSILON) * 10) / 10

        this.setState({
            valid: response.details.valid,
            approved: response.details.approved,
            projectName: response.details.projectName,
            rows: rowsRetrieveList,
            totalPercentageProgress: newTotalPercentageProgress,
            percentageFailure: newPercentageFailure
        })
    }

    deleteQueryHandler = async (rowIndex) => {
        try {
            let row = this.state.rows[rowIndex];
            await apis.retrieveRobot.deleteRobotItem(this.state.id, row.id)

            if (this.state.rows.length <= 1) {
                this.setState({
                    ...this.state,
                    rows: [],
                    id: null
                })
                this.task.stopMonitoringJob();
            } else {
                apis.task.getTask(this.state.id).then(this.refreshHandler)
            }
        } catch (error) {
            toast.error(error)
        }
    }

    retryQueryHandler = async (rowIndex) => {
        try {
            let row = this.state.rows[rowIndex];
            await apis.retrieveRobot.retryRobotItem(this.props.id, row.id)
            this.startProgressMonitoring();
        } catch (error) {
            toast.error(error)
        }
    }

    handleClickDeleteRobot = async () => {
        await apis.retrieveRobot.deleteRobot(this.state.id);
        await this.refreshHandler(null);
        await this.setState({
            id: null
        })
        if (this.props.onDelete instanceof Function) this.props.onDelete()
    }

    render = () => {
        return (
            <div>
                <div className="row mb-5">
                    <h1 className="col"> Robot for user {this.state.creator}, project : {this.state.projectName} </h1>
                    <div className="col-md-2 text-right">
                        <CircularProgressbarWithChildren
                            value={this.state.totalPercentageProgress}
                            text={`Progress : ${this.state.totalPercentageProgress}%`}
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
                <input type='button' className="btn btn-danger" onClick={this.handleClickDeleteRobot}
                       value="Delete Robot"/>
                <RobotTable rows={this.state.rows} approved={this.state.approved} refreshHandler={this.refreshHandler}
                            deleteQueryHandler={this.deleteQueryHandler} retryQueryHandler={this.retryQueryHandler}
                            onSelect={this.setSelect}/>
                <AnonExportDeleteSendButton onAnonClick={this.sendToAnon} onExportClick={this.sendToExport}
                                            onDeleteClick={this.sendToDelete}/>
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