import React, { Component, Fragment } from 'react'
import apis from '../../../../services/apis';
import Select from 'react-select'

import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';

export default class OrthancSettings extends Component {

    /** Init State */
    state = {
        OrthancAddress: '',
        OrthancPort: 0,
        OrthancUsername: '',
        OrthancPassword: '',
        showRestart: false,
        showShutdown: false,
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
        apis.options.setOrthancServer(this.state.OrthancAddress, this.state.OrthancPort,
            this.state.OrthancUsername, this.state.OrthancPassword)
            .then(() => { toast.success('Updated') })
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
                    <h2 className="card-title">Orthanc Server</h2>
                    <label htmlFor="address">Address : </label>
                    <input type='text' name="OrthancAddress" className="form-control" onChange={this.handleChange} value={this.state.OrthancAddress} placeholder="http://" />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" name="OrthancPort" className="form-control" value={this.state.OrthancPort} onChange={this.handleChange} />
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="OrthancUsername" className="form-control" value={this.state.OrthancUsername} onChange={this.handleChange} />
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="OrthancPassword" className="form-control" value={this.state.OrthancPassword} onChange={this.handleChange} />
                </div>
                <div className="form-group text-right">
                    <input type='button' className='btn btn-primary mr-1' onClick={this.submitOrthancSettings} value='Update' />
                    <input type='button' className='btn btn-info mr-1' onClick={this.testConnexion} value='Check Connexion' />

                    <input type='button' className='btn btn-warning mr-1' onClick={() => this.setState({ showRestart: true })} value='Restart' />
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

                    <input type='button' className='btn btn-danger mr-1' onClick={() => this.setState({ showShutdown: true })} value='Shutdown' />
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

                </div>
                <div className="row">
                    <div className="col-md-auto">
                        <label htmlFor="verbosity">Verbosity : </label>
                    </div>
                    <div className="col-sm">
                        <Select name="verbosity" single options={this.verbosities} onChange={this.changeListener} value={this.state.verbositySelected} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
