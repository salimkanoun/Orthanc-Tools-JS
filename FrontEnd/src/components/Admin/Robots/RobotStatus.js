import React, { useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import RobotTable from "../../CommonComponents/RessourcesDisplay/ReactTable/RobotTable";


export default ({}) => {

    const [rows, setRows] = useState([])

    useEffect(() => {
        refreshHandler()
        startRefreshMonitoring()
    }, [])



    const componentWillUnmount = () => {
        stopRefreshMonitoring()
    }

    const startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(refreshHandler, 2000)
    }

    const stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    const validationRobotHandler = (id, refreshHandler) => {
        apis.retrieveRobot.validateRobot(id).then(() => {
            refreshHandler()
        }).catch(error => {
            toast.error(error.statusText, {data:{type:'notification'}})
        })
    }

    const deleteJobHandler = async (id, refreshHandler) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            refreshHandler()
        } catch (error) {
            toast.error(error.statusText, {data:{type:'notification'}})
        }
    }

    const refreshHandler = () => {
        apis.retrieveRobot.getAllRobotsDetails().then((answerData) => {
            setRows(answerData.map(robotJob => ({
                id: robotJob.id,
                name: robotJob.details.projectName,
                username: robotJob.creator,
                retrieve: robotJob.progress.retrieve + '%',
                validation: robotJob.progress.validation + '%',
                state: robotJob.state,
                queriesNb: robotJob.details.items.length,
                valid: robotJob.details.valid,
                approved: robotJob.details.approved
            })))
        }).catch(error => {
            toast.error(error.statusText, {data:{type:'notification'}})
        })
    }

        return (
            <>
                <h2 className="card-title mt-4">Retrieve Robots : </h2>
                <RobotTable robots={rows} deleteJobHandler={deleteJobHandler}
                            refreshHandler={refreshHandler} validationRobotHandler={validationRobotHandler}/>
            </>
        )
}