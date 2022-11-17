import React, { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'
import { Row, Col } from 'react-bootstrap'
/**
 * Form to declare or modify an Orthanc Peer
 */
export default ({ refreshPeerData }) => {

    const [name, setName] = useState()
    const [ip, setIp] = useState()
    const [port, setPort] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    const handleChange = (event) => {
        const target = event.target
        const nameT = target.name
        const value = target.value

        setName(value)

    }

    /**
     * Listener on form submission
     */
    const handleClick = async () => {
        try {
            await apis.peers.updatePeer(name, ip, port, username, password)
            refreshPeerData()
        } catch (error) {
            toast.error(error.statusText, {data:{type:'notification'}})
        }

    }


    return (
        <Fragment>
            <Row className="mt-4">
                <Col>
                    <h2 className="card-title">Add Peer</h2>
                </Col>
            </Row>
            <Row className="mt-4 forms-group align-items-center">
                <Col sm={3}>
                    <label htmlFor="username">Peer Name : </label>
                </Col>
                <Col>
                    <input type='text' name="name" className="form-control" onChange={handleChange} />
                </Col>
            </Row>
            <Row className="mt-4 forms-group align-items-center">
                <Col>
                    <label htmlFor="ip">Url : </label>
                </Col>
                <Col>
                    <input type='text' name="ip" className="form-control" placeholder="http://" onChange={handleChange} />
                </Col>
                <Col>
                    <label htmlFor="port">Port : </label>
                </Col>
                <Col>
                    <input type='number' name="port" className="form-control" onChange={handleChange} />
                </Col>
            </Row>
            <Row className="mt-4 forms-group align-items-center">
                <Col>
                    <label htmlFor="name">Username : </label>
                </Col>
                <Col>
                    <input type='text' name="username" className="form-control" onChange={handleChange} />
                </Col>
                <Col>
                    <label htmlFor="password">Password : </label>
                </Col>
                <Col>
                    <input type='password' name="password" className="form-control" onChange={handleChange} />
                </Col>
            </Row>
            <Row className="mt-4 forms-group align-items-center text-center">
                <Col>
                    <input type='button' className='otjs-button otjs-button-blue' onClick={handleClick} value='Send' />
                </Col>
            </Row>
        </Fragment>
    )

}
