import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Container, Row, Col, Modal } from 'react-bootstrap'

import RobotTable from '../../CommonComponents/RessourcesDisplay/ReactTableV8/RobotTable'
import { errorMessage } from '../../../tools/toastify'
import apis from '../../../services/apis'
import AutoRetrieveRobotDetails from '../../Admin/Robots/AutoRetrieveRobotDetails'

export default () => {

    const [showDetailsRobotId, setShowDetailsRobotId] = useState(null)

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
        }
    })
    const [rows, setRows] = useState([])

    useEffect(() => {
        refreshHandler()
        const intervalChcker = setInterval(refreshHandler, 2000)
        return () => {
            clearInterval(intervalChcker)
        }
    }, [])

    const deleteJobHandler = async (id) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            refreshHandler()
        } catch (error) {
            errorMessage(error.data?.errorMessage ?? 'Robot Deletion Error')
        }
    }

    const refreshHandler = () => {

        let rows = []

        apis.task.getTaskOfUser(store.username, 'retrieve')
            .then(async taksIds => await Promise.all(taksIds.map(id => (!!id ? apis.task.getTask(id) : null))))
            .then((answerData) => {
                answerData.forEach(robotJob => {
                    if (!!robotJob) rows.push({
                        id: robotJob.id,
                        name: robotJob.details.projectName,
                        username: robotJob.creator,
                        validation: robotJob.progress.validation,
                        retrieve: robotJob.progress.retrieve,
                        state: robotJob.state,
                        queriesNb: robotJob.details.items.length,
                        approved: robotJob.details.approved
                    })
                });
            }).catch(error => {
                if (error.status !== 404) errorMessage(error.statusText + ' ' + error.message)
            }).finally(() => {
                setRows(rows)
            })
    }

    return (
        <>
            <Modal fullscreen show={showDetailsRobotId != null} onHide={() => setShowDetailsRobotId(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Retrieve Robot Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AutoRetrieveRobotDetails robotId={showDetailsRobotId} />
                </Modal.Body>
            </Modal>
            <Container fluid>
                <Row className="mt-5">
                    <Col>
                        <h2 className="card-title">Robots History : </h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <RobotTable
                            robots={rows}
                            deleteJobHandler={deleteJobHandler}
                            refreshHandler={refreshHandler}
                            hideValidationButton={true}
                            onShowDetails={(id) => setShowDetailsRobotId(id)}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}