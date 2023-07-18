import React from 'react'
import { Container, Row, Col, FormGroup, Form } from "react-bootstrap"

export default ({ orthancAddress, orthancPort, orthancUsername, orthancPassword, onChange }) => {
    return (
        <Container fluid >
            <Row >
                <Col>
                    <FormGroup>
                        <Form.Label>Adress : </Form.Label>
                        <Form.Control type="text" value={orthancAddress} placeholder="http://" onChange={(event) => onChange('address', event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Port : </Form.Label>
                        <Form.Control type="number" value={orthancPort} placeholder="orthancPort" onChange={(event) => onChange('port', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
            <Row >
                <Col >
                    <FormGroup>
                        <Form.Label> Username : </Form.Label>
                        <Form.Control type="text" value={orthancUsername} placeholder="orthancUsername" onChange={(event) => onChange('username', event.target.value)} />
                    </FormGroup>
                </Col>
                <Col >
                    <FormGroup>
                        <Form.Label> Password : </Form.Label>
                        <Form.Control type="password" value={orthancPassword} placeholder="orthancPassword" onChange={(event) => onChange('password', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
        </Container>
    )
}