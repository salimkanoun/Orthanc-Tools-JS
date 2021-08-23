import React, {Component} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import RobotTable from "../../CommonComponents/RessourcesDisplay/ReactTable/RobotTable";


export default class RobotStatus extends Component {

    state = {
        rows: []
    }


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

    validationRobotHandler = (id, refreshHandler) => {
        apis.retrieveRobot.validateRobot(id).then(() => {
            refreshHandler()
        }).catch(error => {
            toast.error(error.statusText)
        })
    }

    deleteJobHandler = async (id, refreshHandler) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            refreshHandler()
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    refreshHandler = () => {
        apis.retrieveRobot.getAllRobotsDetails().then((answerData) => {
            this.setState({
                rows: answerData.map(robotJob => ({
                    id: robotJob.id,
                    name: robotJob.details.projectName,
                    username: robotJob.creator,
                    retrieve: robotJob.progress.retrieve + '%',
                    validation: robotJob.progress.validation + '%',
                    state: robotJob.state,
                    queriesNb: robotJob.details.items.length,
                    valid: robotJob.details.valid,
                    approved: robotJob.details.approved
                }))
            });
        }).catch(error => {
            toast.error(error.statusText)
        })
    }

    render = () => {
        return (
            <>
                <h2 className="card-title mt-4">Retrieve Robots : </h2>
                <RobotTable robots={this.state.rows} deleteJobHandler={this.deleteJobHandler}
                            refreshHandler={this.refreshHandler} validationRobotHandler={this.validationRobotHandler}/>
            </>
        )
    }
}