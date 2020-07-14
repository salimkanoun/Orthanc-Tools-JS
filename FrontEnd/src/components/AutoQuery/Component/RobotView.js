import React, { Component } from 'react'
import { connect } from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, dateFilter, selectFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import AnonExportDeleteSendButton from '../../Import/AnonExportDeleteSendButton'
import OhifLink from '../../Ohif/OhifLink'
import apis from '../../../services/apis'

import {addStudiesToExportList} from '../../../actions/ExportList'
import {addStudiesToDeleteList} from '../../../actions/DeleteList'
import {addStudiesToAnonList} from '../../../actions/AnonList'

/**
 * View page of a sigle Retrieve Robot content
 * With progress monitoring and delete item action
 */
class RobotView extends Component {

    state = {
        rows : [],
        totalPercentageProgress : 0,
        percentageFailure: 0
    }

    constructor(props){
        super(props)
        this.refreshHandler=this.refreshHandler.bind(this)
        this.startProgressMonitoring = this.startProgressMonitoring.bind(this)
        this.stopProgressMonitoring = this.stopProgressMonitoring.bind(this)
        
    }

    componentDidMount(){
        this.refreshHandler()
        this.startProgressMonitoring()
    }

    componentWillUnmount(){
        this.stopProgressMonitoring()
    }

    columns = [{
        dataField: 'key',
        hidden: true
    }, {
        dataField: 'Level',
        text : 'level',
        filter: selectFilter({
            options: { study : 'study', series : 'series'}
        })
    }, {
        dataField: 'StudyInstanceUID',
        hidden: true
    }, {
        dataField: 'PatientName',
        text : 'Patient Name',
        filter: textFilter()
    }, {
        dataField: 'PatientID',
        text : 'Patient ID',
        filter: textFilter()
    }, {
        dataField : 'StudyDate',
        text : 'Study Date',
        filter: dateFilter()
    }, {
        dataField : 'Modality',
        text : 'Modality',
        filter: textFilter()
    }, {
        dataField : 'StudyDescription',
        text : 'Study Description',
        filter: textFilter()
    }, {
        dataField : 'SeriesDescription',
        text : 'Series Description',
        filter: textFilter()
    }, {
        dataField : 'AccessionNumber',
        text : 'Accession Number',
        filter: textFilter()
    }, {
        dataField : 'OriginAET',
        text : 'AET',
        filter: textFilter()
    }, {
        dataField : 'Status',
        text : 'Status',
        filter: textFilter(),
        style: function callback(cell, row, rowIndex, colIndex) {
            if(cell === 'Retrieved'){
                return ({backgroundColor: 'green'})
            }else if (cell === 'Failed'){
                return ({backgroundColor: 'red'})
            }
         }
    }, {
        dataField : 'Remove',
        text : 'Remove Query',
        formatter : this.removeQueryButton,
        formatExtraData : this
    }, {
        dataField : 'OHIF',
        text : 'View in OHIF',
        formatter : function(cell, row, rowIndex, formatExtraData){
            return (
                <OhifLink StudyInstanceUID = {row.StudyInstanceUID} />
            )
        }
    }, {
        dataField : 'RetrievedOrthancId',
        hidden : true
    }]



    selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            if (row.Status !== 'Retrieved') {
              return false;
            }
          }
    }

    sendToTools(){
        //SK ICI A FAIRE
        //get selected row keys
        let selectedKeyRow = this.node.selectionContext.selected
        //get array of selected rows
        let seletectedRows = this.state.rows.filter(row =>{
            if( selectedKeyRow.includes(row.key) ) return true
            else return false
        })
        //Loop each item to retrieve study level
        for(row of seletectedRows){
            if(row.Level === 'study') {

            }else{

            }
        }
        //send to reducer

        //this.props.addStudiesToExportList()
        //this.props.addStudiesToDeleteList()
        //this.props.addStudiesToAnonList()

    }

    startProgressMonitoring(){
        this.intervalChcker = setInterval(this.refreshHandler, 2000)
    }

    stopProgressMonitoring(){
        clearInterval(this.intervalChcker)
    }

    refreshHandler(){
        apis.queryRobot
        .getRobotDetails(this.props.username)
        .then( (answerData) => {
            
            let rowsRetrieveList = []

            answerData.items.forEach(robotJob => {
                rowsRetrieveList.push({
                    key : Math.random(),
                    //Merge Modalities (study level) to modality column
                    Modality : robotJob.ModalitiesInStudy,
                    //SK PEUT ETRE MERGE SERIES ET STUDY DESCRIPTION
                    ...robotJob
                })
            });

            let newTotalPercentageProgress = 0
            let newPercentageFailure = 0
            if(answerData.totalInstances !== 0){
                newTotalPercentageProgress = Math.round((answerData.progression.Success / answerData.progression.TotalInstances)*100)
                newPercentageFailure = Math.round((answerData.progression.Failure / answerData.progression.TotalInstances)*100)
            }

            this.setState({
                projectName : answerData.projectName,
                rows : rowsRetrieveList,
                totalPercentageProgress : newTotalPercentageProgress,
                percentageFailure : newPercentageFailure
            })

        }).catch(error =>{

        })
    }

    deleteQueryHandler(rowIndex, refreshHandler){
        apis.queryRobot
        .deleteRobotItem(this.props.username, rowIndex)
        .then( () => {
            refreshHandler()
        })

    }

    removeQueryButton(cell, row, rowIndex, formatExtraData) {
        return (<div className="text-center">
            <input type="button" className='btn btn-danger' onClick = {() => formatExtraData.deleteQueryHandler(rowIndex, formatExtraData.refreshHandler)} value = "Remove" />
            </div>)
    }

    render() {
        return (
            <div className="jumbotron">
                <div className="row mb-5">
                <h1 className="col"> Robot for user {this.props.username}, project : {this.state.projectName} </h1>
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
                <BootstrapTable wrapperClasses="table-responsive" keyField="key" striped={true} rowClasses = {this.rowClasses} selectRow = {this.selectRow} filter={filterFactory()} pagination={paginationFactory()} data={this.state.rows} columns={this.columns} />
                <AnonExportDeleteSendButton ref={n => this.node = n} onAnonClick = {'r'} onExportClick={'r'} onDeleteClick={'r'} />
            </div>
        )
    }
}

const mapDispatchToProps = {
    addStudiesToExportList,
    addStudiesToDeleteList,
    addStudiesToAnonList

}

export default connect(null, mapDispatchToProps)(RobotView)