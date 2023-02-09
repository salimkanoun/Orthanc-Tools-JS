import React, { Component, Fragment, useEffect, useState } from 'react'
import apis from '../../../../services/apis'
import Select from 'react-select'

import { toast } from 'react-toastify'
import { Row, Col, Modal } from 'react-bootstrap'
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
    useEffect(()=> {
        functionUseEffect()
    }, [])

    const functionUseEffect = async () => {try {
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
        }}


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
        <Fragment>
            <div className="form-group">
                <Row>
                    <Col>
                        <h2 className="card-title">Orthanc Server</h2>
                    </Col>
                    <Col className="text-center">
                        <input type='button' className='otjs-button otjs-button-blue w-10 me-2' onClick={testConnexion} value='Check Connexion' />
                        <input type='button' className='otjs-button otjs-button-blue w-10 ms-2' onClick={() => setShowOrthancDetails(true)} value='Orthanc Details' />
                        <Modal show={showOrthancDetails} onHide={() => setShowOrthancDetails(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Orthanc Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <OrthancInfos />
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
                <Row className="align-items-center g-3 mt-5">
                    <Col sm={2}>
                        <label htmlFor="address" className="col-form-label">Address : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' name="orthancAddress" className="form-control" onChange={(event) => {setOrthancAddress(event.target ==='checkbox' ? event.target.checked : event.target.value)}} value={orthancAddress} placeholder="http://" />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="port" className="col-form-label">Port : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='number' min="0" max="999999" name="orthancPort" className="form-control" value={orthancPort} onChange={(event) => {setOrthancPort(event.target ==='checkbox' ? event.target.checked : event.target.value)}} />
                    </Col>
                </Row>
                <Row className="align-items-center g-3 mt-2">
                    <Col sm={2}>
                        <label htmlFor="username" className="col-form-label">Username : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' name="orthancUsername" className="form-control" value={orthancUsername} onChange={(event) => {setOrthancUsername(event.target ==='checkbox' ? event.target.checked : event.target.value)}} />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="password" className="col-form-label">Password : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='password' name="orthancPassword" className="form-control" value={orthancPassword} onChange={(event) => {setOrthancPassword(event.target ==='checkbox' ? event.target.checked : event.target.value)}} />
                    </Col>
                </Row>
            </div>
            <Row className="mt-5 text-center">
                <Col sm={4}>
                    <input type='button' className='otjs-button otjs-button-blue w-10' onClick={submitOrthancSettings} value='Update' />

                </Col>
                <Col sm={4}>
                    <input type='button' className='otjs-button otjs-button-orange w-10' onClick={() => setShowRestart(true)} value='Restart' />
                    <Modal show={showRestart} onHide={() => setShowRestart(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm restart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to restart Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <input type='button' className='btn btn-secondary' onClick={() => setShowRestart(false)} value="Close" />
                            <input type='button' className='btn btn-warning' onClick={reset} value="Restart" />
                        </Modal.Footer>
                    </Modal>
                </Col>
                <Col sm={4}>
                    <input type='button' className='otjs-button otjs-button-red w-10' onClick={() => setShowShutdown(true)} value='Shutdown' />
                    <Modal show={showShutdown} onHide={() => setShowShutdown(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Shutdown</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to shutdown Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <input type='button' className='btn btn-secondary' onClick={() => setShowShutdown(false)} value="Close" />
                            <input type='button' className='btn btn-danger' onClick={shutdown} value="Shutdown" />
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            <Row className="mt-5 align-items-center">
                <Col sm={2}>
                    <label htmlFor="verbosity">Verbosity : </label>
                </Col>
                <Col sm={10}>
                    <Select name="verbosity" single options={verbosities} onChange={changeListener} value={verbositySelected} />
                </Col>

            </Row>
        </Fragment>
    )
}
