import React, { Component, Fragment, useEffect, useState } from 'react'
import apis from '../../../../services/apis'
import Select from 'react-select'

import { toast } from 'react-toastify'
import { Row, Col, Modal, Form, FormGroup, Button } from 'react-bootstrap'
import OrthancInfos from './OrthancInfos'

export default () => {
    const [orthancAddress, setOrthancAddress] = useState('')
    const [orthancPort, setOrthancPort] = useState(0)
    const [orthancUsername, setOrthancUsername] = useState('')
    const [orthancPassword, setOrthancPassword] = useState('')
    const [showRestart, setShowRestart] = useState(false)
    const [showShutdown, setShowShutdown] = useState(false)
    const [showOrthancDetails, setShowOrthancDetails] = useState(false)
    const [verbositySelected, setVerbositySelected] = useState(null)


    const verbosities = [
        { value: 'default', label: 'Default' },
        { value: 'verbose', label: 'Verbose' },
        { value: 'trace', label: 'Trace' }
    ]


    /**
     * Fetch value from BackEnd
     */
    useEffect(() => {
        const functionUseEffect = async () => {
            try {
                let answer = await apis.options.getOrthancServer()
                console.log(answer)
                setOrthancAddress(answer.orthancAddress)
                setOrthancPassword(answer.orthancPassword)
                setOrthancPort(answer.orthancPort)
                setOrthancUsername(answer.orthancUsername)
            } catch (error) {
                toast.error(error.statusText, { data: { type: 'notification' } })
            }

            try {
                let verbosity = await apis.options.getVerbosity()
                let verbosityOption = getVerbosityOption(verbosity)
                setVerbositySelected(verbosityOption)

            } catch (error) {
                toast.error(error.statusText, { data: { type: 'notification' } })
            }
        }
        functionUseEffect()
    }, [])


    /**
     * Send new value to BackEnd
     */
    const submitOrthancSettings = async () => {
        apis.options.setOrthancServer(orthancAddress, orthancPort,
            orthancUsername, orthancPassword)
            .then(() => { toast.warning('Updated, modify your environnement settings for the next start', { data: { type: 'notification' } }) })
            .catch((error) => { toast.error(error.statusText, { data: { type: 'notification' } }) })
    }

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */
    const testConnexion = () => {
        apis.options.getOrthancSystem().then((answer) => {
            toast.success('Orthanc Version: ' + answer.Version, { data: { type: 'notification' } })
        }).catch(error => { toast.error(error.statusText, { data: { type: 'notification' } }) })
    }

    const reset = () => {
        apis.options.resetOrthanc()
            .then(() => { toast.success('Restart Done', { data: { type: 'notification' } }); setShowRestart(false) })
            .catch(error => { toast.error(error.statusText, { data: { type: 'notification' } }) })

    }

    const shutdown = () => {
        apis.options.shutdownOrthanc()
            .then(() => { toast.success('Orthanc Stopped', { data: { type: 'notification' } }); setShowShutdown(false) })
            .catch((error) => {
                toast.error(error.statusText, { data: { type: 'notification' } })
            })
    }

    const changeListener = (event) => {
        apis.options.setVerbosity(event.value).then(() => {
            toast.success('Verbosity Updated', { data: { type: 'notification' } })
            setVerbositySelected(event)
        }).catch((error) => {
            toast.error(error.statusText, { data: { type: 'notification' } })
        })

    }


    const getVerbosityOption = (verbosity) => {
        let index = -1
        verbosities.forEach(element => {
            if (element.value === verbosity) {
                index = verbosities.indexOf(element)
            }
        })
        return verbosities[index]
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

            </FormGroup>


            <Row >
                <Col>
                    <FormGroup>
                        <Form.Label>Adress : </Form.Label>
                        <Form.Control type="text" value={orthancAddress} placeholder="http://" onChange={(event) => { setOrthancAddress(event.target === 'checkbox' ? event.target.checked : event.target.value) }} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Port : </Form.Label>
                        <Form.Control type="number" value={orthancPort} placeholder="orthancPort" onChange={(event) => { setOrthancPort(event.target === 'checkbox' ? event.target.checked : event.target.value) }} />
                    </FormGroup>
                </Col>
            </Row>

            <Row >
                <Col >
                    <FormGroup>
                        <Form.Label> Username : </Form.Label>
                        <Form.Control type="text" value={orthancUsername} placeholder="orthancUsername" onChange={(event) => { setOrthancUsername(event.target === 'checkbox' ? event.target.checked : event.target.value) }} />
                    </FormGroup>
                </Col>
                <Col >
                    <FormGroup>
                        <Form.Label> Password : </Form.Label>
                        <Form.Control type="password" value={orthancPassword} placeholder="orthancPassword" onChange={(event) => { setOrthancPassword(event.target === 'checkbox' ? event.target.checked : event.target.value) }} />
                    </FormGroup>
                </Col>
            </Row>

            <Row >
                <Col>
                    <FormGroup>
                        <Button className='otjs-button otjs-button-blue w-10' onClick={submitOrthancSettings}> Update </Button>
                    </FormGroup>
                </Col>
                <Col >
                    <FormGroup>
                        <Button className='otjs-button otjs-button-orange w-10' onClick={() => setShowRestart(true)}> Restart </Button>
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
                    </FormGroup>
                </Col>
                <Col >
                    <FormGroup>
                        <Button className='otjs-button otjs-button-red w-10' onClick={() => setShowShutdown(true)} > Shutdown </Button>
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
                </Col>
            </Row>

            <Row >
                <Col >
                    <FormGroup>
                        <Form.Label> Verbosity </Form.Label>
                        <Select value={verbositySelected} options={verbosities} onChange={changeListener} />
                    </FormGroup>

                </Col>

            </Row>
        </Form>
    )
}
