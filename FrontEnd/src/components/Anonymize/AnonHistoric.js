import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import apis from '../../services/apis';
import AnonymizedResults from './AnonymizedResults';
import task from '../../services/task';
import { Modal } from "react-bootstrap";
import CommonTable from "../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

function HistoricTable({ tasks, deleteJobHandler, setSelectedTask }) {
    const columns = useMemo(() => [{
        accessor: 'id',
        Header: 'id'
    }, {
        accessor: 'queriesNb',
        Header: 'Number of Queries'
    }, {
        accessor: 'state',
        Header: 'State'
    }, {
        id: 'details',
        Header: 'Show Details',
        Cell: ({ row }) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-green w-10'
                    onClick={() => setSelectedTask(row.values.id)}
                    value="Show Result" />
            </div>)
        }
    }, {
        id: 'remove',
        Header: 'Remove Robot',
        Cell: ({ row }) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red w-10'
                        onClick={() => deleteJobHandler(row.id)}
                        value="Remove Job" />
                </div>
            )
        }
    }], [deleteJobHandler, setSelectedTask]);

    const data = useMemo(() => tasks, [tasks]);

    return <CommonTable columns={columns} data={data} />
}

export default ({ username }) => {

    const [selectedTask, setSelectedTask] = useState(null)
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
            <HistoricTable tasks={rows} deleteJobHandler={deleteJobHandler}
                setSelectedTask={selectedTask => {
                    setSelectedTask({ selectedTask });
                }} />
        </>
    )
}

