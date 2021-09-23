import React, {Component} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import task from '../../../services/task';
import RobotTable from "../../CommonComponents/RessourcesDisplay/ReactTable/RobotTable";
import {Col, Row} from 'react-bootstrap'

export default class RobotJistoric extends Component {

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

    deleteJobHandler = async (id, refreshHandler) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            refreshHandler()
        } catch (error) {
            toast.error(error.statusText + ':' + error.message)
        }
    }

    refreshHandler = () => {

        let rows = []

        apis.task.getTaskOfUser(this.props.username, 'retrieve')
            .then(async taksIds => await Promise.all(taksIds.map(id => (!!id ? task.getTask(id) : null))))
            .then((answerData) => {
                answerData.forEach(robotJob => {
                    if (!!robotJob) rows.push({
                        id: robotJob.id,
                        name: robotJob.details.projectName,
                        username: robotJob.creator,
                        validation: robotJob.progress.validation,
                        retrieve: robotJob.progress.retrieve,
                        state: robotJob.state,
                        queriesNb: robotJob.details.items.length
                    })
                });

            }).catch(error => {
            console.log(error)
            if (error.status !== 404) toast.error(error.statusText + ' ' + error.message)
        }).finally(() => {
            this.setState({
                rows: rows
            })
        })
    }

    render = () => {
        return (
            <>
                <Row className="mt-5">
                    <Col>
                        <h2 className="card-title">Retrieve Robots : </h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <RobotTable robots={this.state.rows} deleteJobHandler={this.deleteJobHandler}
                                    refreshHandler={this.refreshHandler}
                                    validationRobotHandler={this.validationRobotHandler}
                                    hideValidationButton={true}/>
                    </Col>
                </Row>


            </>
        )
    }
}