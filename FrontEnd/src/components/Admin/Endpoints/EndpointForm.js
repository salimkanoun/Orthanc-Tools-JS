import React, {Component, Fragment, useState} from 'react'
import Select from 'react-select'
import {toast} from 'react-toastify'
import apis from '../../../services/apis'
import {Row, Col} from 'react-bootstrap'
/**
 * Form to declare or modify an Ssh Keys
 */
export default ({onCreateEndpoint}) => {

    const [keys, setKeys] = useState([]);
    const [name, setName] = useState();
    const [protocol, setProtocol] = useState();
    const [label, setLabel] = useState();
    const [host, setHost] = useState();
    const [port, setPort] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [targetFolder, setTargetFolder] = useState();
    const [ssh, setSsh] = useState();
    const [sshKey, setSshKey] = useState();
    const [ssl, setSsl] = useState();
    const [digest, setDigest] = useState();


    const protocols = [
        {value: 'sftp', label: 'Sftp'},
        {value: 'ftp', label: 'Ftps/Ftp'},
        {value: 'webdav', label: 'Webdav'}
    ]

    const componentDidMount = () => {
        loadKeys()
    }

    const loadKeys = async () => {
        let sshKeys = []
        try {
            let response = await apis.sshKeys.getKeysExpend()
            response.forEach(key => {
                sshKeys.push({value: key.id, label: key.label})
            })
        } catch (error) {
            toast.error(error.statusText)
        }

        setKeys(sshKeys)
    }

    const handleSelectChange = (name) => {
        return ((value) => {
            setName(value.value)
        })
    }

    /**
     * Fill input text of users in current state
     * @param {*} event
     */
    const handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        setName(value)

    }

    /**
     * Listener on form submission
     */
    const handleClick = () => {
        let postData = {}
        postData.protocol = protocol
        postData.label = label
        postData.host = host
        postData.port = port
        postData.username = username
        postData.password = password || null
        postData.targetFolder = targetFolder || ''
        if (protocol === 'sftp' && ssh) {
            postData.sshKey = sshKey
        } else if (protocol === 'ftp') {
            postData.ssl = ssl || false
        } else if (protocol === 'webdav') {
            postData.digest = digest || false
        }

        onCreateEndpoint(postData)

    }

    const readyToSubmit = () => {
        let ready = (protocol)
        ready = ready && (label)
        ready = ready && (host)
        ready = ready && (port)
        ready = ready && (username)
        ready = ready && (sshKey || !(protocol === 'sftp' && ssh))

        return ready
    }


        return (
            <Fragment>
                <h2 className="card-title">Add Export Endpoint</h2>
                <div className="form-group mt-4">
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <label htmlFor="protocol">Protocol </label>
                        </Col>
                        <Col sm={4}>
                            <Select classNamePrefix="select" name="protocol" single options={protocols}
                                onChange={handleSelectChange('protocol')} value={protocols[protocol]}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="label">Label : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="label" className="form-control" onChange={handleChange}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="host">Host : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="host" className="form-control" onChange={handleChange}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="port">Port : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='number' name="port" className="form-control" onChange={handleChange}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        {
                            protocol === 'sftp' ?
                            <>
                                <Col sm={2}>
                                    <label htmlFor="ssh">Use a private key?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssh" className="form-check-input"
                                    onChange={handleChange}/>
                                </Col></> :
                            <></>
                        }
                        {
                            protocol === 'ftp' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="ssl">Use ssl?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssl" className="form-check-input"
                                        onChange={handleChange}/>
                                </Col></> :
                                   <> </>
                        }
                        {
                            protocol === 'webdav' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="digest">Use digest?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="digest" className="form-check-input"
                                        onChange={handleChange}/>
                                </Col></> :
                                <></>
                        }
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="username">Username : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="username" className="form-control" onChange={handleChange}/>
                        </Col>
                            {
                                ssh && protocol === 'sftp' ?
                                <>
                                    <Col sm={2}>
                                        <label htmlFor="sshKey">Ssh Key : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <Select classNamePrefix="select" name="sshKey" single options={keys}
                                            onChange={handleSelectChange('sshKey')}
                                            value={keys[sshKey]}/>
                                    </Col></> : <>
                                    <Col sm={2}>
                                        <label htmlFor="password">Password : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <input type='password' name="password" className="form-control"
                                            onChange={handleChange}/>
                                    </Col>
                                   </>
                            } 
                    </Row>
                   
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="targetFolder">Destination Folder : </label>
                        </Col>
                        <Col>
                            <input type='text' name="targetFolder" className="form-control" onChange={handleChange}/>
                        </Col>
                    </Row>
                </div>
                <Row className="text-center mt-4">
                    <Col>
                        <input disabled={!readyToSubmit()} type='button' className='otjs-button otjs-button-blue'
                           onClick={handleClick} value='Send'/>
                    </Col>
                </Row>
            </Fragment>
        )
}
