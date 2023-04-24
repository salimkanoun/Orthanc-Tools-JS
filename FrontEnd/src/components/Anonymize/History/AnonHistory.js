import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Modal } from "react-bootstrap";

import apis from '../../../services/apis';
import AnonymizedResults from '../Progression/AnonymizedResults';
import task from '../../../services/task';
import AnonHistoryTable from './AnonHistoryTable';

export default ({ username }) => {

    const [selectedTask, setSelectedTask] = useState(null)
    const [rows, setRows] = useState([])

    useEffect(() => {
        refreshHandler()
        startRefreshMonitoring()
        return () => {
            stopRefreshMonitoring()
        }
    }, [])

    const startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(refreshHandler, 2000)
    }

    const stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    const deleteJobHandler = async (id) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            await refreshHandler()
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }

    const refreshHandler = () => {
        apis.task.getTaskOfUser(username, 'anonymize')
            .then(async taksIds => await Promise.all(taksIds.map(id => task.getTask(id))))
            .then((answerData) => {
                setRows(answerData.map(robotJob => ({
                    id: robotJob.id,
                    username: robotJob.creator,
                    state: robotJob.state,
                    queriesNb: robotJob.details.items.length
                })))

            }).catch(error => {
                if (error.status === 404) {
                    toast.error(error.statusMessage, { data: { type: 'notification' } });
                }
            })
    }

    return (
        <>
            <Modal dialogClassName={"big-modal"} show={!!selectedTask}
                onHide={() => setSelectedTask(null)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Anonymize Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask ?
                        <AnonymizedResults anonTaskID={selectedTask} /> :
                        null
                    }
                </Modal.Body>
            </Modal>
            <AnonHistoryTable tasks={rows} deleteJobHandler={deleteJobHandler}
                setSelectedTask={selectedTask => {
                    setSelectedTask({ selectedTask });
                }} />
        </>
    )
}

