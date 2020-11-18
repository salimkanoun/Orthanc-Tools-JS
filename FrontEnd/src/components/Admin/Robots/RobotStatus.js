import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom'
import apis from '../../../services/apis';

export default class RobotStatus extends Component {

    state = {
        rows : []
    }

    constructor(props){
        super(props)
        this.refreshHandler = this.refreshHandler.bind(this)
        this.deleteJobHandler = this.deleteJobHandler.bind(this)
        this.validationRobotHandler = this.validationRobotHandler.bind(this)
        this.startRefreshMonitoring = this.startRefreshMonitoring.bind(this)
        this.stopRefreshMonitoring = this.stopRefreshMonitoring.bind(this)
    }

    componentDidMount(){
        this.refreshHandler()
        this.startRefreshMonitoring()
    }

    componentWillUnmount () {
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring(){
        this.intervalChcker = setInterval(this.refreshHandler, 2000)
    }

    stopRefreshMonitoring () {
        clearInterval(this.intervalChcker)
    }

    columns = [{
            dataField: 'name',
            text : 'Name'
        }, {
            dataField: 'username',
            text : 'Username'
        }, {
            dataField: 'queriesNb',
            text : 'Number of Queries'
        }, {
            dataField: 'details',
            text: 'Show Details',
            formatter: this.showRobotDetailsButton
        }, {
            dataField: 'validation',
            text: 'Validation Status',
            formatter : this.validationButton,
            formatExtraData : this
        }, {
            dataField : 'remove',
            text : 'Remove Robot',
            formatter : this.removeRobotButton,
            formatExtraData : this
        }
    ];

    validationButton(cell, row, rowIndex, parentComponent){
        console.log(row)
        if(row.validation !== 'Waiting Approbation'){
            return <div className="text-center">{row.validation}</div>
        }else{
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-success' onClick={() => parentComponent.validationRobotHandler(row.username, parentComponent.refreshHandler)} value="Validate" />
                </div>
            )
        }

    }

    showRobotDetailsButton(cell, row, rowIndex, parentComponent) {
        return <Link className='nav-link btn btn-info' to={'/robot/'+row.username} > Details </Link>
    }

    removeRobotButton(cell, row, rowIndex, parentComponent) {
        return (
            <div className="text-center">
                <input type="button" className='btn btn-danger' onClick = {() => parentComponent.deleteJobHandler(row.username, parentComponent.refreshHandler)} value = "Remove Job" />
            </div>
        )
    }

    validationRobotHandler(username, refreshHandler){

        apis.retrieveRobot.validateRobot(username).then(()=>{
            refreshHandler()
        })
    }

    deleteJobHandler (username , refreshHandler) {

        apis.retrieveRobot.deleteRobot(username).then(()=>{
            refreshHandler()
        })

    }

    refreshHandler(){
        apis.retrieveRobot.getAllRobotsDetails().then( (answerData) => {
            let rows = []
            answerData.forEach(robotJob => {
                rows.push({
                    key : Math.random(),
                    name : robotJob.content.projectName,
                    username : robotJob.creator,
                    queriesNb : robotJob.content.items.length,
                    validation : robotJob.content.isValidated
                })
                
            });

            this.setState({
                rows : rows
            })
        }).catch(error => {console.log(error)})
    }

    render() {
        return (
            <BootstrapTable keyField="username" striped={true} data={this.state.rows} columns={this.columns} wrapperClasses='table-responsive' />
        )
    }
}