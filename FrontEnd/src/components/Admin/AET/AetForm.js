import React, { useState } from 'react'
import apis from '../../../services/aets'
import { Row, Col, FormGroup, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import { keys } from '../../../model/Constant'
import { useCustomMutation } from '../../../services/ReactQuery/hooks'

export default () => {

    const [name, setName] = useState('');
    const [aetName, setAetName] = useState('');
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');
    const [manufacturer, setManufacturer] = useState({ value: 'Generic', label: 'Generic' });

    const manufacturers = [
        { value: 'Generic', label: 'Generic' },
        { value: 'GenericNoWildcardInDates', label: 'GenericNoWildcardInDates' },
        { value: 'GenericNoUniversalWildcard', label: 'GenericNoUniversalWildcard' },
        { value: 'Vitrea', label: 'Vitrea' },
        { value: 'GE', label: 'GE' }
    ]

    const manufacturerOptions = manufacturers.map((type) => ({
        value: type.value,
        label: type.label
    }))

    const manufacturerChangeListener = (option) => {
        setManufacturer(option)
    }

    const sendAet = useCustomMutation(
        ({ name, aetName, ip, port, manufacturer }) => apis.updateAet(name, aetName, ip, port, manufacturer),
        [[keys.AETS_KEY]],
        () => resetForm()
    )

    const onHandleSend = () => {
        let manufacturerValue = manufacturer.value
        sendAet.mutate({ name, aetName, ip, port, manufacturerValue })
    }


    const resetForm = () => {
        setName('')
        setAetName('')
        setIp('')
        setPort('')
        setManufacturer({ value: 'Generic', label: 'Generic' })
    }

    return (
        <Form>
            <h2 className="card-title">New Aet</h2>
            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label>Name :</Form.Label>
                        <Form.Control type="text" value={name} placeholder="Name" onChange={(event) => setName(event.target.value)} />
                    </FormGroup>
                </Col>

                <Col>
                    <FormGroup>
                        <Form.Label>Aet Name :</Form.Label>
                        <Form.Control type="text" value={aetName} placeholder="Aet Name" onChange={(event) => setAetName(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label>IP adress :</Form.Label>
                        <Form.Control type="text" value={ip} placeholder="IP adress" onChange={(event) => setIp(event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Port :</Form.Label>
                        <Form.Control type="number" min="0" max="999999" value={port} placeholder="Port" onChange={(event) => setPort(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                <Form.Label>Manufacturer :</Form.Label>
                <Select value={manufacturer} options={manufacturerOptions} onChange={manufacturerChangeListener} isClearable />
            </FormGroup>
            <FormGroup>
                <Row className="d-flex justify-content-end">
                    <Button onClick={onHandleSend} className='otjs-button otjs-button-blue'> Send </Button>
                </Row>
            </FormGroup>
        </Form>
    )
}
