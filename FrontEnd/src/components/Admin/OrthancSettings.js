import React, { Component, Fragment } from 'react'
import apis from '../../services/apis';
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal'

export default class OrthancSettings extends Component {

    /** Init State */
    state = {
        OrthancAddress : '',
        OrthancPort : 0,
        OrthancUsername : '',
        OrthancPassword : '', 
        showRestart: false, 
        showShutdown: false
    }
    
    constructor(props) {
        super(props)
        this.submitOrthancSettings = this.submitOrthancSettings.bind(this)
        this.reset = this.reset.bind(this)
        this.shutdown = this.shutdown.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.testConnexion = this.testConnexion.bind(this)
        this.handleShowRestart = this.handleShowRestart.bind(this)
        this.handleShowShutdown = this.handleShowShutdown.bind(this)
        this.handleCloseRestart = this.handleCloseRestart.bind(this)
        this.handleCloseShutdown = this.handleCloseShutdown.bind(this)
        this.changeListener = this.changeListener.bind(this)
    }

    /**
     * Fetch value from BackEnd
     */
    async componentDidMount(){
        let answer = await apis.options.getOrthancServer()
        let verbosity = await apis.options.getVerbosity()
        this.setState({verbosity : verbosity, ...answer})
        this.getDefaultOption()
        
    }

    /**
     * Store form values in state
     * @param {*} event 
     */
    handleChange(event) {
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
    async submitOrthancSettings() {
        apis.options.setOrthancServer(this.state.OrthancAddress, this.state.OrthancPort, 
            this.state.OrthancUsername, this.state.OrthancPassword)
    }

    /**
     * Try to connect to Orthanc System API, response is shown in an toastify
     */
    testConnexion () {
        apis.options.getOrthancSystem()
    }

    reset(){
        apis.options.resetOrthanc()
        this.handleCloseRestart()
    }

    shutdown(){
        apis.options.shutdownOrthanc()
        this.handleCloseShutdown()
    }

    changeListener(event){
        apis.options.setVerbosity(event.value)
        this.setState({optionSelected: event})
    }

    //PopUp to confirm restart and shutdown action 
    handleShowRestart(){
        this.setState({showRestart: true})
    }
    handleCloseRestart(){
        this.setState({showRestart: false})
    }
    handleCloseShutdown(){
        this.setState({showShutdown: false})
    }
    handleShowShutdown(){
        this.setState({showShutdown: true})
    }

    verbosities = [
        { value: 'default', label: 'Default'},
        { value: 'verbose', label: 'Verbose'},
        { value: 'trace', label: 'Trace'}
    ]

    getDefaultOption(){
        let index = -1
        this.verbosities.forEach(element => {
            if (element.value === this.state.verbosity) {
                index = this.verbosities.indexOf(element)
            }
        })
        this.setState({optionSelected: this.verbosities[index] })
    }

    render() {
        return (
            <Fragment>
                <div className="form-group">
                    <h2 className="card-title">Orthanc Server</h2>
                    <label htmlFor="address">Address : </label>
                    <input type='text' name="OrthancAddress" className="row form-control" onChange={this.handleChange} value={this.state.OrthancAddress} placeholder="http://" />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" name="OrthancPort" className="row form-control" value={this.state.OrthancPort} onChange={this.handleChange} />
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="OrthancUsername" className="row form-control" value={this.state.OrthancUsername} onChange={this.handleChange} />
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="OrthancPassword" className="row form-control" value={this.state.OrthancPassword} onChange={this.handleChange} />
                </div>
                <div className="form-group text-right">
                    <input type='button' className='btn btn-primary mr-1' onClick={this.submitOrthancSettings} value='Update' />
                    <input type='button' className='btn btn-info mr-1' onClick={this.testConnexion} value='Check Connexion' />
                    <input type='button' className='btn btn-warning mr-1' onClick={this.handleShowRestart} value='Restart' />
                    <Modal show={this.state.showRestart} onHide={this.handleCloseRestart}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm restart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to restart Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <input type='button' className='btn btn-secondary' onClick={this.handleCloseRestart} value="Close" />
                            <input type='button' className='btn btn-warning' onClick={this.reset} value="Restart" />
                        </Modal.Footer>
                    </Modal>
                    <input type='button' className='btn btn-danger mr-1' onClick={this.handleShowShutdown} value='Shutdown' />
                    <Modal show={this.state.showShutdown} onHide={this.handleCloseShutdown}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Shutdown</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to shutdown Orthanc system ?</Modal.Body>
                        <Modal.Footer>
                            <input type='button' className='btn btn-secondary' onClick={this.handleCloseShutdown} value="Close" />
                            <input type='button' className='btn btn-danger' onClick={this.shutdown} value="Shutdown" />
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="row">
                    <div className="col-md-auto">
                        <label htmlFor="verbosity">Verbosity : </label>
                    </div>
                    <div className="col-sm">
                        <Select name="verbosity" single options={this.verbosities} onChange={this.changeListener} value={this.state.optionSelected}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}
