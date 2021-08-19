import React, {Component, Fragment} from 'react'
import Select from 'react-select'
import {toast} from 'react-toastify'
import apis from '../../../services/apis'
import {Row, Col} from 'react-bootstrap'
/**
 * Form to declare or modify an Ssh Keys
 */
export default class EndpointForm extends Component {

    state = {
        keys: []
    }

    protocols = [
        {value: 'sftp', label: 'Sftp'},
        {value: 'ftp', label: 'Ftps/Ftp'},
        {value: 'webdav', label: 'Webdav'}
    ]

    componentDidMount = () => {
        this.loadKeys()
    }

    loadKeys = async () => {
        let sshKeys = []
        try {
            let response = await apis.sshKeys.getKeysExpend()
            response.forEach(key => {
                sshKeys.push({value: key.id, label: key.label})
            })
        } catch (error) {
            toast.error(error.statusText)
        }

        this.setState({keys: sshKeys})
    }

    handleSelectChange = (name) => {
        return ((value) => {
            this.setState({
                [name]: value.value
            })
        })
    }

    /**
     * Fill input text of users in current state
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
     * Listener on form submission
     */
    handleClick = () => {
        let postData = {}

        postData.protocol = this.state.protocol
        postData.label = this.state.label
        postData.host = this.state.host
        postData.port = this.state.port
        postData.username = this.state.username
        postData.password = this.state.password || null
        postData.targetFolder = this.state.targetFolder || ''
        if (this.state.protocol === 'sftp' && this.state.ssh) {
            postData.sshKey = this.state.sshKey
        } else if (this.state.protocol === 'ftp') {
            postData.ssl = this.state.ssl || false
        } else if (this.state.protocol === 'webdav') {
            postData.digest = this.state.digest || false
        }

        this.props.onCreateEndpoint(postData)

    }

    readyToSubmit = () => {
        let ready = (this.state.protocol)
        ready = ready && (this.state.label)
        ready = ready && (this.state.host)
        ready = ready && (this.state.port)
        ready = ready && (this.state.username)
        ready = ready && (this.state.sshKey || !(this.state.protocol === 'sftp' && this.state.ssh))

        return ready
    }

    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Add Export Endpoint</h2>
                <div className="form-group mt-4">
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <label htmlFor="protocol">Protocol </label>
                        </Col>
                        <Col sm={4}>
                            <Select classNamePrefix="select" name="protocol" single options={this.protocols}
                                onChange={this.handleSelectChange('protocol')} value={this.protocols[this.state.protocol]}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="label">Label : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="label" className="form-control" onChange={this.handleChange}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="host">Host : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="host" className="form-control" onChange={this.handleChange}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="port">Port : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='number' name="port" className="form-control" onChange={this.handleChange}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        {
                            this.state.protocol === 'sftp' ?
                            <>
                                <Col sm={2}>
                                    <label htmlFor="ssh">Use a private key?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssh" className="form-check-input"
                                    onChange={this.handleChange}/>
                                </Col></> :
                            <></>
                        }
                        {
                            this.state.protocol === 'ftp' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="ssl">Use ssl?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssl" className="form-check-input"
                                        onChange={this.handleChange}/>
                                </Col></> :
                                   <> </>
                        }
                        {
                            this.state.protocol === 'webdav' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="digest">Use digest?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="digest" className="form-check-input"
                                        onChange={this.handleChange}/>
                                </Col></> :
                                <></>
                        }
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="username">Username : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="username" className="form-control" onChange={this.handleChange}/>
                        </Col>
                            {
                                this.state.ssh && this.state.protocol === 'sftp' ?
                                <>
                                    <Col sm={2}>
                                        <label htmlFor="sshKey">Ssh Key : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <Select classNamePrefix="select" name="sshKey" single options={this.state.keys}
                                            onChange={this.handleSelectChange('sshKey')}
                                            value={this.state.keys[this.state.sshKey]}/>
                                    </Col></> : <>
                                    <Col sm={2}>
                                        <label htmlFor="password">Password : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <input type='password' name="password" className="form-control"
                                            onChange={this.handleChange}/>
                                    </Col>
                                   </>
                            } 
                    </Row>
                   
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="targetFolder">Destination Folder : </label>
                        </Col>
                        <Col>
                            <input type='text' name="targetFolder" className="form-control" onChange={this.handleChange}/>
                        </Col>
                    </Row>
                </div>
                <Row className="text-center mt-4">
                    <Col>
                        <input disabled={!this.readyToSubmit()} type='button' className='otjs-button otjs-button-blue'
                           onClick={this.handleClick} value='Send'/>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}
