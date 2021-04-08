import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import task from '../../../services/task';

export default class RobotJistoric extends Component {

    state = {
        rows: []
    }

    columns = [{
        dataField: 'name',
        text: 'Name'
    }, {
        dataField: 'queriesNb',
        text: 'Number of Queries'
    }, {
        dataField: 'progress',
        text: 'Progress'
    }, {
        dataField: 'state',
        text: 'State'
    }, {
        dataField: 'details',
        text: 'Show Details',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return <Link className='nav-link btn btn-info' to={'/robot/' + row.id} > Details </Link>
        }
    }, {
        dataField: 'remove',
        text: 'Remove Robot',
        formatExtraData: this,
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={() => parentComponent.deleteJobHandler(row.id, parentComponent.refreshHandler)} value="Remove Job" />
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

    deleteJobHandler = async (id, refreshHandler) => {
        try{
            await apis.retrieveRobot.deleteRobot(id)
            refreshHandler()
        }catch(error){
            toast.error(error.statusText)
        }
    }

    refreshHandler = () => {
        apis.task.getTaskOfUser(this.props.username, 'retrieve')
                .then(async taksIds => await Promise.all(taksIds.map(id=>task.getTask(id))))
                .then((answerData) => {

            let rows = []

            answerData.forEach(robotJob => {
                rows.push({
                    id: robotJob.id,
                    name: robotJob.details.projectName,
                    username: robotJob.creator,
                    progress: (robotJob.progress.retrieve+robotJob.progress.validation)/2,
                    state: robotJob.state,
                    queriesNb: robotJob.details.items.length
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