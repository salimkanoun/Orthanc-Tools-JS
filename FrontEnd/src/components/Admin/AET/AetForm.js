import React, { Fragment, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import apis from '../../../services/aets'
import { Row, Col } from 'react-bootstrap'
/**
 * Form to declare or modify an AET
 */
export default ({ refreshAetData }) => {

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
     * Fill manufacturer select choice in current state
     * @param {*} item 
     */
    const manufacturerChangeListener = (item) => {
        setManufacturer(item)
    }

    /**
     * Listener on form submission
     */
    const handleClick = async () => {
        try {
            await apis.updateAet(name, aetName, ip, port, manufacturer.value)
            setName('')
            setAetName('')
            setIp('')
            setPort('')
            setManufacturer({ value: 'Generic', label: 'Generic' })

            refreshAetData()
        } catch (error) {
            toast.error(error.statusText, {data:{type:'notification'}})
        }

    }


    return (
        <Fragment>
            <Row className="mt-3">
                <Col>
                    <h2 className="card-title">New Aet</h2>
                </Col>
            </Row>
            <Row className="form-group mt-4 align-items-center">
                <Col sm={2}>
                    <label htmlFor="name">Name : </label>
                </Col>
                <Col sm={4}>
                    <input type='text' name="name" value={name} className="form-control" onChange={handleChange} />
                </Col>
                <Col sm={2}>
                    <label htmlFor="aetName">Aet Name : </label>
                </Col>
                <Col sm={4}>
                    <input type='text' name="aetName" value={aetName} className="form-control" onChange={handleChange} />
                </Col>

            </Row>
            <Row className="form-group mt-4 align-items-center">
                <Col sm={2}>
                    <label htmlFor="ip">IP adress : </label>
                </Col>
                <Col sm={4}>
                    <input type='text' name="ip" value={ip} className="form-control" onChange={handleChange} />
                </Col>
                <Col sm={2}>
                    <label htmlFor="port">Port : </label>
                </Col>
                <Col sm={4}>
                    <input type='number' min="0" max="999999" value={port} name="port" className="form-control" onChange={handleChange} />
                </Col>
            </Row>
            <Row className="form-group mt-4 align-items-center">
                <Col sm={2}>
                    <label htmlFor="manufacturer">Manufacturer : </label>
                </Col>
                <Col>
                    <Select className="col-sm" options={manufacturers} value={manufacturer} name="manufacturer" onChange={manufacturerChangeListener} />
                </Col>
            </Row>
            <Row className="mt-4 align-items-center text-center">
                <Col>
                    <input type='button' className='otjs-button otjs-button-blue' onClick={handleClick} value='Send' />

                </Col>
            </Row>
        </Fragment>
    )
}
