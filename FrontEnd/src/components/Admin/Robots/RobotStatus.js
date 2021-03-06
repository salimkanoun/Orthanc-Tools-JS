import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';

export default class RobotStatus extends Component {

    state = {
        rows: []
    }

    columns = [{
        dataField: 'name',
        text: 'Name'
    }, {
        dataField: 'username',
        text: 'Username'
    }, {
        dataField: 'queriesNb',
        text: 'Number of Queries'
    }, {
        dataField: 'details',
        text: 'Show Details',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return <Link className='nav-link btn btn-info' to={'/robot/' + row.username} > Details </Link>
        }
    }, {
        dataField: 'validation',
        text: 'Validation Status',
        formatExtraData: this,
        formatter: (cell, row, rowIndex, parentComponent) => {
            if (row.valid) {
                if(!row.approved){
                    return (
                        <div className="text-center">
                            <input type="button" className='btn btn-success' onClick={() => parentComponent.validationRobotHandler(row.username, parentComponent.refreshHandler)} value="Validate" />
                        </div>
                    )
                }else{
                    return(<p> Validated & approved </p>)
                }
            } else {
                return(<p> Analysing project </p>)
            }
        }
    }, {
        dataField: 'remove',
        text: 'Remove Robot',
        formatExtraData: this,
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={() => parentComponent.deleteJobHandler(row.username, parentComponent.refreshHandler)} value="Remove Job" />
                </div>
            )
        }
    }];


    componentDidMount = () => {
        this.refreshHandler()
        this.startRefreshMonitoring()
    }

    componentWillUnmount = () => {
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(this.refreshHandler, 2000)
    }

    stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    validationRobotHandler = (username, refreshHandler) => {
        apis.retrieveRobot.validateRobot(username).then(() => {
            refreshHandler()
        }).catch ( error => { toast.error(error.statusText) })
    }

    deleteJobHandler = async (username, refreshHandler) => {
        try{
            await apis.retrieveRobot.deleteRobot(username)
            refreshHandler()
        }catch(error){
            toast.error(error.statusText)
        }
    }

    refreshHandler = () => {
        apis.retrieveRobot.getAllRobotsDetails().then((answerData) => {

            let rows = []

            answerData.forEach(robotJob => {
                rows.push({
                    key: Math.random(),
                    name: robotJob.details.projectName,
                    username: robotJob.creator,
                    queriesNb: robotJob.details.items.length,
                    valid: robotJob.details.valid,
                    approved: robotJob.details.approved
                })

            });

            this.setState({
                rows: rows
            })

        }).catch(error => { toast.error(error.statusText) })
    }

    render = () => {
        return (
            <>
                <h2 className="card-title">Retrieve Robots : </h2>
                <BootstrapTable keyField="username" striped={true} data={this.state.rows} columns={this.columns} wrapperClasses='table-responsive' />
            </>
        )
    }
}