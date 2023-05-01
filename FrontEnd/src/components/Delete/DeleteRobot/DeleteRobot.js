import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apis from '../../../services/apis'
import { errorMessage } from '../../../tools/toastify'
import { Col, Container, Row } from 'react-bootstrap'
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

export default () => {

    const [status, setStatus] = useState('')
    const [progress, setProgress] = useState('')


    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
        }
    })

    useEffect(() => {
        refreshInfo()
        let interval = setInterval(refreshInfo, 2000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const refreshInfo = async () => {
        let retrieveIds = await apis.task.getTaskOfUser(store.username, 'delete')
        if (retrieveIds.length > 0) {
            try {
                let response = await apis.task.getTask(retrieveIds[0]);
                refreshHandler(response)
            } catch (error) {
                errorMessage(error?.data?.errorMessage ?? 'Cant fetch robot status')
            }

        }
    }

    const refreshHandler = (response) => {
        setStatus(response.state)
        setProgress(response.progress)
    }


    return (
        <Container fluid>
            <Row>
                <Col className='d-flex align-items-center'>
                    <h1>Status - {status}</h1>
                </Col>
                <Col style={{maxWidth : '200px'}} className="d-flex justify-align-end">
                    <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        styles={buildStyles({
                            textSize: '10px'
                        })}
                    />
                </Col>
            </Row>
        </Container>
    )
}