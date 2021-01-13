import React, { Component, Fragment } from 'react'
import apis from '../../../../services/apis';
import Select from 'react-select'

import ModalRestart from './ModalRestart'
import ModalShutdown from './ModalShutdown';

export default class OrthancSettings extends Component {

    /** Init State */
    state = {
        OrthancAddress: '',
        OrthancPort: 0,
        OrthancUsername: '',
        OrthancPassword: '',
        showRestart: false,
        showShutdown: false
    }

    /**
     * Fetch value from BackEnd
     */
    componentDidMount = async () => {
        let answer = await apis.options.getOrthancServer()
        let verbosity = await apis.options.getVerbosity()
        this.setState({ verbosity: verbosity, ...answer })
        this.getDefaultOption()

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
    }

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */
    testConnexion = () => {
        apis.options.getOrthancSystem()
    }

    reset = () => {
        apis.options.resetOrthanc()
        this.handleCloseRestart()
    }

    shutdown = () => {
        apis.options.shutdownOrthanc()
        this.handleCloseShutdown()
    }

    changeListener = (event) => {
        apis.options.setVerbosity(event.value)
        this.setState({ optionSelected: event })
    }

    verbosities = [
        { value: 'default', label: 'Default' },
        { value: 'verbose', label: 'Verbose' },
        { value: 'trace', label: 'Trace' }
    ]

    getDefaultOption = () => {
        let index = -1
        this.verbosities.forEach(element => {
            if (element.value === this.state.verbosity) {
                index = this.verbosities.indexOf(element)
            }
        })
        this.setState({ optionSelected: this.verbosities[index] })
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
                    <ModalRestart show={this.state.showRestart} onHide={() => this.setState({ showRestart: false })} />
                    <input type='button' className='btn btn-danger mr-1' onClick={() => this.setState({ showShutdown: true })} value='Shutdown' />
                    <ModalShutdown show={this.state.showShutdown} onHide={() => this.setState({ showShutdown: false })} />
                </div>
                <div className="row">
                    <div className="col-md-auto">
                        <label htmlFor="verbosity">Verbosity : </label>
                    </div>
                    <div className="col-sm">
                        <Select name="verbosity" single options={this.verbosities} onChange={this.changeListener} value={this.state.optionSelected} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
