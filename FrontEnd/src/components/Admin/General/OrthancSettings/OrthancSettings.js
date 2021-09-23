import React, { Component, Fragment } from 'react'
import apis from '../../../../services/apis'
import Select from 'react-select'

import { toast } from 'react-toastify'
import {Row, Col, Modal} from 'react-bootstrap'
import OrthancInfos from './OrthancInfos'

export default class OrthancSettings extends Component {

    /** Init State */
    state = {
        orthancAddress: '',
        orthancPort: 0,
        orthancUsername: '',
        orthancPassword: '',
        showRestart: false,
        showShutdown: false,
        showOrthancDetails : false,
        verbositySelected: null
    }

    
    verbosities = [
        { value: 'default', label: 'Default' },
        { value: 'verbose', label: 'Verbose' },
        { value: 'trace', label: 'Trace' }
    ]

    /**
     * Fetch value from BackEnd
     */
    componentDidMount = async () => {

        try {
            let answer = await apis.options.getOrthancServer()
            this.setState({
                ...answer
            })
        } catch (error) {
            toast.error(error.statusText)
        }

        try {
            let verbosity = await apis.options.getVerbosity()
            let verbosityOption = this.getVerbosityOption(verbosity)
            this.setState({
                verbositySelected: verbosityOption
            })

        } catch (error) {
            toast.error(error.statusText)
        }


    }

    /**
     * Store form values in state
     * @param {*} event 
     */
    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        this.setState({
            [name]: value
        })

    }

    /**
     * Send new value to BackEnd
     */
    submitOrthancSettings = async () => {
        apis.options.setOrthancServer(this.state.orthancAddress, this.state.orthancPort,
            this.state.orthancUsername, this.state.orthancPassword)
            .then(() => { toast.warning('Updated, modify your environnement settings for the next start') })
            .catch((error) => { toast.error(error.statusText) })
    }

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */
    testConnexion = () => {
        apis.options.getOrthancSystem().then((answer) => {
            toast.success('Orthanc Version: ' + answer.Version)
        }).catch(error => { toast.error(error.statusText) })
    }

    reset = () => {
        apis.options.resetOrthanc()
            .then(() => { toast.success('Restart Done') ; this.setState({ showRestart: false }) })
            .catch(error => { toast.error(error.statusText) })
            
    }

    shutdown = () => {
        apis.options.shutdownOrthanc()
            .then(() => { toast.success('Orthanc Stopped') ; this.setState({ showShutdown: false })})
            .catch((error) => {
                toast.error(error.statusText)
            })
    }

    changeListener = (event) => {
        apis.options.setVerbosity(event.value).then(() => {
            toast.success('Verbosity Updated')
            this.setState({ verbositySelected: event })
        }).catch((error) => {
            toast.error(error.statusText)
        })

    }


    getVerbosityOption = (verbosity) => {
        let index = -1
        this.verbosities.forEach(element => {
            if (element.value === verbosity) {
                index = this.verbosities.indexOf(element)
            }
        })
        return this.verbosities[index]
    }

    render = () => {
        return (
            <Fragment>
                <div className="form-group">
                    <Row>
                        <Col>
                            <h2 className="card-title">Orthanc Server</h2>
                        </Col>
                        <Col className="text-center">
                            <input type='button' className='otjs-button otjs-button-blue w-10 me-2' onClick={this.testConnexion} value='Check Connexion' />
                            <input type='button' className='otjs-button otjs-button-blue w-10 ms-2' onClick={() => this.setState({ showOrthancDetails: true })} value='Orthanc Details' />
                            <Modal show={this.state.showOrthancDetails} onHide={() => this.setState({ showOrthancDetails: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Orthanc Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <OrthancInfos/>
                                </Modal.Body>
                            </Modal>
                        </Col>
                    </Row>
                    <Row className="align-items-center g-3 mt-5">
                        <Col sm={2}>
                            <label htmlFor="address" className="col-form-label">Address : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="orthancAddress" className="form-control" onChange={this.handleChange} value={this.state.orthancAddress} placeholder="http://" />
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="port" className="col-form-label">Port : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='number' min="0" max="999999" name="orthancPort" className="form-control" value={this.state.orthancPort} onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row className="align-items-center g-3 mt-2">
                        <Col sm={2}>
                            <label htmlFor="username" className="col-form-label">Username : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="orthancUsername" className="form-control" value={this.state.orthancUsername} onChange={this.handleChange} />
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="password"  className="col-form-label">Password : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='password' name="orthancPassword" className="form-control" value={this.state.orthancPassword} onChange={this.handleChange} />
                        </Col>
                    </Row> 
                </div>
                <Row className="mt-5 text-center">
                    <Col sm={4}>
                        <input type='button' className='otjs-button otjs-button-blue w-10' onClick={this.submitOrthancSettings} value='Update' />

                    </Col>
                    <Col sm={4}>
                        <input type='button' className='otjs-button otjs-button-orange w-10' onClick={() => this.setState({ showRestart: true })} value='Restart' />
                        <Modal show={this.state.showRestart} onHide={() => this.setState({ showRestart: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm restart</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure to restart Orthanc system ?</Modal.Body>
                            <Modal.Footer>
                                <input type='button' className='btn btn-secondary' onClick={() => this.setState({ showRestart: false })} value="Close" />
                                <input type='button' className='btn btn-warning' onClick={this.reset} value="Restart" />
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col sm={4}>
                        <input type='button' className='otjs-button otjs-button-red w-10' onClick={() => this.setState({ showShutdown: true })} value='Shutdown' />
                        <Modal show={this.state.showShutdown} onHide={() => this.setState({ showShutdown: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Shutdown</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure to shutdown Orthanc system ?</Modal.Body>
                            <Modal.Footer>
                                <input type='button' className='btn btn-secondary' onClick={() => this.setState({ showShutdown: false })} value="Close" />
                                <input type='button' className='btn btn-danger' onClick={this.shutdown} value="Shutdown" />
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                <Row className="mt-5 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="verbosity">Verbosity : </label>
                    </Col>
                    <Col sm={10}>
                        <Select name="verbosity" single options={this.verbosities} onChange={this.changeListener} value={this.state.verbositySelected} />
                    </Col>

                </Row>
            </Fragment>
        )
    }
}
