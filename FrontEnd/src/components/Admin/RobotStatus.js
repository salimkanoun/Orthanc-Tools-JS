import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom'

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
        dataField: 'key',
        hidden: true
    },{
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
    },{
        dataField: 'validated',
        text: 'Validation Status',
        formatter : this.validationComponent,
        formatExtraData : this
    }, {
        dataField : 'remove',
        text : 'Remove Robot',
        formatter : this.removeRobotButton,
        formatExtraData : this
    }];

    validationComponent(cell, row, rowIndex, formatExtraData){
        if(row.validated !== 'Not Done'){
            return <div className="text-center">{row.validated}</div>
        }else{
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-success' onClick={() => formatExtraData.validationRobotHandler(row.username, formatExtraData.refreshHandler)} value="Validate" />
                </div>
            )
        }

    }

    showRobotDetailsButton(cell, row, rowIndex, formatExtraData) {
        return <Link className='nav-link btn btn-info' to={'/robot/'+row.username} > Details </Link>
    }

    removeRobotButton(cell, row, rowIndex, formatExtraData) {
        return (
            <div className="text-center">
                <input type="button" className='btn btn-danger' onClick = {() => formatExtraData.deleteJobHandler(row.username, formatExtraData.refreshHandler)} value = "Remove Job" />
            </div>
        )
    }

    validationRobotHandler(username, refreshHandler){

        fetch("/api/robot/"+username+"/validate", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
        }).then(()=>{
            refreshHandler()
        }).catch( (error)=>{ console.log(error) } )

    }

    deleteJobHandler (username , refreshHandler) {
        
        fetch("/api/robot/"+username, {
            method: "DELETE",
            })
        .then(()=>{
            refreshHandler()
        }).catch( (error)=>{ console.log(error) } )

    }


    refreshHandler(){
        
        fetch("/api/robot", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((answer)=>{return answer.json() })
        .then( (answerData) => {
                let rows = []
                answerData.forEach(robotJob => {
                    rows.push({
                        key : Math.random(),
                        name : robotJob.projectName,
                        username : robotJob.username,
                        queriesNb : robotJob.retrieveList.length,
                        validated : robotJob.validated
                    })
                    
                });

                this.setState({
                    rows : rows
                })
           })
    }

    render() {
        return (
            <BootstrapTable keyField="key" striped={true} data={this.state.rows} columns={this.columns} />
        )
    }
}