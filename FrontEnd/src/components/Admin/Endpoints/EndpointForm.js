import React, { Fragment, useEffect, useState} from 'react'
import Select from 'react-select'
import {toast} from 'react-toastify'
import apis from '../../../services/apis'
import {Row, Col} from 'react-bootstrap'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
/**
 * Form to declare or modify an Ssh Keys
 */
export default ({onCreateEndpoint}) => {

    const [endpoint, setEndpoint] = useState({
        protocol : null,
        label : null,
        host : null,
        port : null,
        username : null,
        password : null,
        targetFolder : null,
        ssh : null,
        sshKey : null,
        ssl : null,
        digest : null
    })

    const protocols = [
        {value: 'sftp', label: 'Sftp'},
        {value: 'ftp', label: 'Ftps/Ftp'},
        {value: 'webdav', label: 'Webdav'}
    ]

    const {data: keys, isLoading} = useCustomQuery(
        ['endpoints'],
        () => apis.sshKeys.getKeysExpend(),
        (answer) => {
            return answer.map((key) => {
                return ({
                    value : key.id,
                    label: key.label
                })
            })
        }
    )

    const handleSelectChange = (key, event) => {
        setEndpoint((endpoint)=> ({
            ...endpoint,
            [key] : event
        }))
    }

    /**
     * Fill input text of users in current state
     * @param {*} event
     */
     const handleChange = (key, value) => {
        setEndpoint((endpoint) => ({
            ...endpoint,
            [key]: value
        }))
    }

    /**
     * Listener on form submission
     */
    const handleClick = () => {
        let postData = {}
        postData.protocol = endpoint.protocol
        postData.label = endpoint.label
        postData.host = endpoint.host
        postData.port = endpoint.port
        postData.username = endpoint.username
        postData.password = endpoint.password || null
        postData.targetFolder = endpoint.targetFolder || ''
        if (endpoint.protocol === 'sftp' && endpoint.ssh) {
            postData.sshKey = endpoint.sshKey
        } else if (endpoint.protocol === 'ftp') {
            postData.ssl = endpoint.ssl || false
        } else if (endpoint.protocol === 'webdav') {
            postData.digest = endpoint.digest || false
        }
        onCreateEndpoint(postData)
    }

    const readyToSubmit = () => {
        let ready = (endpoint.protocol)
        ready = ready && (endpoint.label)
        ready = ready && (endpoint.host)
        ready = ready && (endpoint.port)
        ready = ready && (endpoint.username)
        ready = ready && (endpoint.sshKey || !(endpoint.protocol === 'sftp' && endpoint.ssh))

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
                                onChange={(event) => handleSelectChange('protocol', event)} value={protocols[endpoint.protocol]}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="label">Label : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="label" className="form-control" onChange={(event) => handleChange('label', event.target.value)}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="host">Host : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="host" className="form-control" onChange={(event) => handleChange('host', event.target.value)}/>
                        </Col>
                        <Col sm={2}>
                            <label htmlFor="port">Port : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='number' name="port" className="form-control" onChange={(event) => handleChange('port', event.target.value)}/>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-4">
                        {
                            endpoint.protocol === 'sftp' ?
                            <>
                                <Col sm={2}>
                                    <label htmlFor="ssh">Use a private key?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssh" className="form-check-input"
                                    onChange={(event) => handleChange('ssh', event.target.value)}/>
                                </Col></> :
                            <></>
                        }
                        {
                            endpoint.protocol === 'ftp' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="ssl">Use ssl?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="ssl" className="form-check-input"
                                        onChange={(event) => handleChange('ssl', event.target.value)}/>
                                </Col></> :
                                   <> </>
                        }
                        {
                            endpoint.protocol === 'webdav' ?
                                <>
                                <Col sm={2}>
                                    <label htmlFor="digest">Use digest?</label>
                                </Col>
                                <Col sm={2}>
                                    <input type='checkbox' name="digest" className="form-check-input"
                                        onChange={(event) => handleChange('digest', event.target.value)}/>
                                </Col></> :
                                <></>
                        }
                    </Row>
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="username">Username : </label>
                        </Col>
                        <Col sm={4}>
                            <input type='text' name="username" className="form-control" onChange={(event) => handleChange('username', event.target.value)}/>
                        </Col>
                            {
                                endpoint.ssh && endpoint.protocol === 'sftp' ?
                                <>
                                    <Col sm={2}>
                                        <label htmlFor="sshKey">Ssh Key : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <Select classNamePrefix="select" name="sshKey" single options={keys}
                                            onChange={(event) => handleSelectChange('sshKey', event)}
                                            value={keys[endpoint.sshKey]}/>
                                    </Col></> : <>
                                    <Col sm={2}>
                                        <label htmlFor="password">Password : </label>
                                    </Col>
                                    <Col sm={4}>
                                        <input type='password' name="password" className="form-control"
                                            onChange={(event) => handleChange('password', event.target.value)}/>
                                    </Col>
                                   </>
                            } 
                    </Row>
                   
                    <Row className="align-items-center mt-4">
                        <Col sm={2}>
                            <label htmlFor="targetFolder">Destination Folder : </label>
                        </Col>
                        <Col>
                            <input type='text' name="targetFolder" className="form-control" onChange={(event) => handleChange('targetFolder', event.target.value)}/>
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
