import React, { useState } from 'react'
import Select from 'react-select'
import apis from '../../../services/apis'
import { Row, Col, Form, Button, FormGroup } from 'react-bootstrap'
import { keys } from '../../../model/Constant'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'
/**
 * Form to declare or modify an Ssh Keys
 */
export default ({ onCreateEndpoint }) => {

    const [endpoint, setEndpoint] = useState({
        protocol: null,
        label: null,
        host: null,
        port: null,
        username: null,
        password: null,
        targetFolder: null,
        ssh: null,
        sshKey: null,
        ssl: null,
        digest: null
    })

    const protocols = [
        { value: 'sftp', label: 'Sftp' },
        { value: 'ftp', label: 'Ftps/Ftp' },
        { value: 'webdav', label: 'Webdav' }
    ]

    const { data, isLoading } = useCustomQuery(
        [keys.ENDPOINTS_KEY],
        () => apis.sshKeys.getKeysExpend(),
        (answer) => {
            return answer.map((key) => {
                return ({
                    value: key.id,
                    label: key.label
                })
            })
        }
    )

    const handleSelectChange = (key, event) => {
        setEndpoint((endpoint) => ({
            ...endpoint,
            [key]: event
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
        onCreateEndpoint.mutate({postData})
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
        <Form>
            <h2 className="card-title">Add Export Endpoint</h2>
            
            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Protocol </Form.Label>
                        <Select classNamePrefix="select" name="protocol" single options={protocols}
                            onChange={(event) => handleSelectChange('protocol', event)} value={protocols[endpoint.protocol]} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label> Label : </Form.Label>
                        <Form.Control type="text" value={endpoint.label} onChange={(event) => handleChange('label', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Host : </Form.Label>
                        <Form.Control type="text" value={endpoint.host} onChange={(event) => handleChange('host', event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label> Port </Form.Label>
                        <Form.Control type="number" value={endpoint.port} onChange={(event) => handleChange('port', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                {
                    endpoint.protocol === 'sftp' ?
                        <Col>
                            <FormGroup>
                                <Form.Label>Use a private key?</Form.Label>
                                <Form.Check Check={endpoint.ssh} onChange={(event) => handleChange('ssh', event.target.value)} />
                            </FormGroup>
                        </Col>
                        :
                        <></>
                }
                {
                    endpoint.protocol === 'ftp' ?
                        <Col>
                            <FormGroup>
                                <Form.Label>Use ssl?</Form.Label>
                                <Form.Check Check={endpoint.ssl} onChange={(event) => handleChange('ssl', event.target.value)} />
                            </FormGroup>
                        </Col>
                        :
                        <> </>
                }
                {
                    endpoint.protocol === 'webdav' ?
                        <Col>
                            <FormGroup>
                                <Form.Label>Use digest?</Form.Label>
                                <Form.Check Check={endpoint.digest} onChange={(event) => handleChange('digest', event.target.value)} />
                            </FormGroup>
                        </Col>
                        :
                        <></>
                }
            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Username : </Form.Label>
                        <Form.Control type="text" value={endpoint.username} onChange={(event) => handleChange('username', event.target.value)} />
                    </FormGroup>
                </Col>
                {
                    endpoint.ssh && endpoint.protocol === 'sftp' ?
                        <>
                            <Col>
                                <FormGroup>
                                    <Form.Label> Ssh Key : </Form.Label>
                                    <Select single options={data} onChange={(event) => handleSelectChange('sshKey', event)} value={data[endpoint.sshKey]} />
                                </FormGroup>
                            </Col>
                        </>
                        :
                        <>
                            <Col>
                                <FormGroup>
                                    <Form.Label> Password</Form.Label>
                                    <Form.Control type="password" value={endpoint.password} onChange={(event) => handleChange('password', event.target.value)} />
                                </FormGroup>
                            </Col>
                        </>
                }
            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Destination Folder : </Form.Label>
                        <Form.Control type="text" value={endpoint.targetFolder} onChange={(event) => handleChange('targetFolder', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>


            <Row className="justify-content-md-center">
                <Button disabled={!readyToSubmit()} className='otjs-button otjs-button-blue'
                    onClick={handleClick}> Send </Button>
            </Row>
        </Form>
    )
}
