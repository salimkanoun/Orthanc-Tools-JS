import React, { useState } from 'react'

import { Row, Col, Modal, Form, FormGroup, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { useCustomMutation, useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks'

import OrthancSettingsForms from './OrthancSettingsForms'
import OrthancInfos from './OrthancInfos'
import apis from '../../../../services/apis'
import { keys } from '../../../../model/Constant'

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

    const verbosities = [
        { value: 'default', label: 'Default' },
        { value: 'verbose', label: 'Verbose' },
        { value: 'trace', label: 'Trace' }
    ]

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

    const { data: verbosity } = useCustomQuery(
        [keys.ORTHANC_VERBOSITY_KEY],
        () => apis.options.getVerbosity()
    )


    const updateVerbosity = useCustomMutation(
        ({ verbosity }) => apis.options.setVerbosity(verbosity),
        [[keys.ORTHANC_VERBOSITY_KEY]]
    )


    const submitOrthancSettings = useCustomMutation(
        ({ orthancAddress, orthancPort, orthancUsername, orthancPassword }) => {
            apis.options.setOrthancServer(orthancAddress, orthancPort, orthancUsername, orthancPassword)
        },
        [[keys.ORTHANC_SETTINGS_KEY]]
    )

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */

    const testConnexion = () => {
        apis.options.getOrthancSystem().then((answer) => {
            toast.success('Orthanc Version: ' + answer.Version )
        }).catch(error => { toast.error(error.statusText) })
    }

    const reset = () => {
        apis.options.resetOrthanc()
            .then(() => { toast.success('Restart Done')})
            .catch(error => { toast.error(error.statusText) })
        setShowRestart(false)
    }

    const shutdown = () => {
        apis.options.shutdownOrthanc()
            .then(() => { toast.success('Orthanc Stopped')})
            .catch((error) => {
                toast.error(error.statusText)
            })
        setShowShutdown(false)
    }

    const onSettingsChange = (key, value) => {
        setOrthancSettings((orthancSettings) => ({
            ...orthancSettings,
            [key]: value
        }))
    }

    const onVerbosityChange = (selectedOption) => {
        let verbosity = selectedOption.value
        updateVerbosity.mutate({ verbosity })
    }


    return (
        <Form>
            <FormGroup>
                <h2 className="card-title">Orthanc Server</h2>
                <Button className='otjs-button otjs-button-blue w-10 me-2' onClick={testConnexion}> Check Connexion </Button>
                <Button className='otjs-button otjs-button-blue w-10 me-2' onClick={() => setShowOrthancDetails(true)}> Orthanc Details </Button>
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
                    <Row>
                        <OrthancSettingsForms orthancAddress={orthancSettings.address} orthancPort={orthancSettings.port} orthancUsername={orthancSettings.username} orthancPassword={orthancSettings.password} onChange={onSettingsChange} />
                        <Row className="justify-content-md-center">
                            <Button className='otjs-button otjs-button-blue w-10' onClick={() => submitOrthancSettings.mutate({ ...orthancSettings })}> Update </Button>
                        </Row>
                    </Row>
                    :
                    null
            }
            <Row >
                <Col>
                    <Button className='otjs-button otjs-button-orange w-10' onClick={() => setShowRestart(true)}> Restart </Button>
                </Col>
                <Col >
                    <Button className='otjs-button otjs-button-red w-10' onClick={() => setShowShutdown(true)} > Shutdown </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Verbosity </Form.Label>
                        <Select value={verbosities.find((verbosityOption) => verbosityOption.value === verbosity)} options={verbosities} onChange={onVerbosityChange} />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}
