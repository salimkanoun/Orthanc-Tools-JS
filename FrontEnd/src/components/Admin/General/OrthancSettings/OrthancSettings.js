import React, { useState } from 'react'

import { Row, Modal, Form, FormGroup, Button } from 'react-bootstrap'

import { useCustomMutation, useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks'

import OrthancSettingsForms from './OrthancSettingsForms'
import OrthancInfos from './OrthancInfos'
import apis from '../../../../services/apis'
import { keys } from '../../../../model/Constant'
import { errorMessage, successMessage } from '../../../../tools/toastify'

export default () => {

    const [orthancSettings, setOrthancSettings] = useState({
        address: '',
        port: '',
        username: '',
        password: ''
    })

    const [showRestart, setShowRestart] = useState(false)
    const [showShutdown, setShowShutdown] = useState(false)
    const [showOrthancDetails, setShowOrthancDetails] = useState(false)

    const { isLoading } = useCustomQuery(
        [keys.ORTHANC_SETTINGS_KEY],
        () => apis.options.getOrthancServer(),
        undefined,
        undefined,
        (answer) => {
            setOrthancSettings({
                address: answer.orthancAddress,
                port: answer.orthancPort,
                username: answer.orthancUsername,
                password: answer.orthancPassword
            })
        }
    )

    const submitOrthancSettings = useCustomMutation(
        ({ address, port, username, password }) => {
            apis.options.setOrthancServer(address, port, username, password)
        },
        [[keys.ORTHANC_SETTINGS_KEY]]
    )

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */

    const testConnexion = () => {
        apis.options.getOrthancSystem().then((answer) => {
            successMessage("Orthanc Version: " + answer.Version)
        }).catch(error => { errorMessage(error?.response?.data) })
    }

    const reset = () => {
        apis.options.resetOrthanc()
            .then(() => { successMessage('Restart Done') })
            .catch(error => { errorMessage(error.response?.data) })
        setShowRestart(false)
    }

    const shutdown = () => {
        apis.options.shutdownOrthanc()
            .then(() => { successMessage('Orthanc Stopped') })
            .catch((error) => {
                errorMessage(error.response?.data)
            })
        setShowShutdown(false)
    }

    const onSettingsChange = (key, value) => {
        setOrthancSettings((orthancSettings) => ({
            ...orthancSettings,
            [key]: value
        }))
    }

    return (
        <>
            <h1 className="card-title">Orthanc Server</h1>
            <Form>
                <FormGroup>
                    <Modal show={showOrthancDetails} onHide={() => setShowOrthancDetails(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Orthanc Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <OrthancInfos />
                        </Modal.Body>
                    </Modal>
                    <Modal show={showRestart} onHide={() => setShowRestart(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm restart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to restart Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <FormGroup>
                                <Button className='btn btn-secondary' onClick={() => setShowRestart(false)}> Close </Button>
                                <Button className='btn btn-warning' onClick={reset} >Restart</Button>
                            </FormGroup>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showShutdown} onHide={() => setShowShutdown(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Shutdown</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to shutdown Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <FormGroup>
                                <Button className='btn btn-secondary' onClick={() => setShowShutdown(false)}> Close </Button>
                                <Button className='btn btn-danger' onClick={shutdown}> Shutdown</Button>
                            </FormGroup>
                        </Modal.Footer>
                    </Modal>
                </FormGroup>
                {
                    !isLoading ?
                        <Row className='mb-3'>
                            <OrthancSettingsForms orthancAddress={orthancSettings.address} orthancPort={orthancSettings.port} orthancUsername={orthancSettings.username} orthancPassword={orthancSettings.password} onChange={onSettingsChange} />
                            <Row className="d-flex justify-content-end">
                                <Button className='otjs-button otjs-button-blue w-10' onClick={() => submitOrthancSettings.mutate({ ...orthancSettings })}> Update </Button>
                            </Row>
                        </Row>
                        :
                        null
                }
                <Row className='d-flex justify-content-between' >
                    <Button className='otjs-button otjs-button-blue w-10 me-2' onClick={testConnexion}> Check Connexion </Button>
                    <Button className='otjs-button otjs-button-blue w-10 me-2' onClick={() => setShowOrthancDetails(true)}> Orthanc Details </Button>
                    <Button className='otjs-button otjs-button-orange w-10' onClick={() => setShowRestart(true)}> Restart </Button>
                    <Button className='otjs-button otjs-button-red w-10' onClick={() => setShowShutdown(true)} > Shutdown </Button>

                </Row>

            </Form>
        </>
    )
}
