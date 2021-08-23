import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'
import { Row, Col } from 'react-bootstrap'
/**
 * Form to declare or modify an Orthanc Peer
 */
export default class PeerForm extends Component {

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        })

    }

    /**
     * Listener on form submission
     */
    handleClick = async () => {
        try {
            await apis.peers.updatePeer(this.state.name, this.state.ip, this.state.port, this.state.username, this.state.password)
            this.props.refreshPeerData()
        } catch (error) {
            toast.error(error.statusText)
        }

    }


    render = () => {
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
                        <input type='text' name="name" className="form-control" onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row className="mt-4 forms-group align-items-center">
                    <Col>
                        <label htmlFor="ip">Url : </label>
                    </Col>
                    <Col>  
                        <input type='text' name="ip" className="form-control" placeholder="http://" onChange={this.handleChange} />
                    </Col>
                    <Col>
                        <label htmlFor="port">Port : </label>
                    </Col>
                    <Col>
                        <input type='number' name="port" className="form-control" onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row className="mt-4 forms-group align-items-center">
                    <Col>
                        <label htmlFor="name">Username : </label>
                    </Col>
                    <Col>
                        <input type='text' name="username" className="form-control" onChange={this.handleChange} />
                    </Col>
                    <Col>
                        <label htmlFor="password">Password : </label>
                    </Col>
                    <Col>
                        <input type='password' name="password" className="form-control" onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row className="mt-4 forms-group align-items-center text-center">
                    <Col>
                        <input type='button' className='otjs-button otjs-button-blue' onClick={this.handleClick} value='Send' />
                    </Col>
                </Row>
            </Fragment>
        )
    }
}
