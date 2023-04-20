import React, { useState } from 'react'
import { Row, Col, Form, FormGroup, Button } from 'react-bootstrap'

import apis from '../../../services/apis'
import { keys } from '../../../model/Constant'
import { useCustomMutation } from '../../../services/ReactQuery/hooks'
/**
 * Form to declare or modify an Orthanc Peer
 */
export default () => {

    const [name, setName] = useState()
    const [ip, setIp] = useState()
    const [port, setPort] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()


    const sendPeer = useCustomMutation(
        ({ name, ip, port, username, password }) => {
            apis.peers.updatePeer(name, ip, port, username, password)
        },
        [[keys.PEERS_KEY]]
    )


    return (
        <Form autoComplete='off'>
            <h2 className="card-title">Add Peer</h2>

            <FormGroup>
                <Form.Label> Peer Name : </Form.Label>
                <Form.Control type="text" value={name} placeholder="Name" onChange={(event) => setName(event.target.value)} />
            </FormGroup>


            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Url : </Form.Label>
                        <Form.Control type="text" value={ip} placeholder="http://" onChange={(event) => setIp(event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label> Port : </Form.Label>
                        <Form.Control type="text" value={port} placeholder="port" onChange={(event) => setPort(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row >
                <Col>
                    <FormGroup>
                        <Form.Label>Username : </Form.Label>
                        <Form.Control autoComplete='off' type="text" value={username} placeholder="username" onChange={(event) => setUsername(event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label >Password : </Form.Label>
                        <Form.Control autoComplete='off' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <FormGroup className='d-flex justify-content-end'>
                <Button className='otjs-button otjs-button-blue' onClick={() => sendPeer.mutate({ name, ip, port, username, password })}> Send </Button>
            </FormGroup>
        </Form>
    ) 
}
