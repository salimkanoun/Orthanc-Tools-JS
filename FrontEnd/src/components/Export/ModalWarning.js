import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

export default class ModalWarning extends Component {

    render = () => {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm export</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Some studies are not anonymized !
                </Modal.Body>
                <Modal.Footer>
                    <Button className='otjs-button otjs-button-red' onClick={this.props.onHide}>Cancel</Button>
                    {this.props.button}
                </Modal.Footer>
            </Modal>
        )
    }
}