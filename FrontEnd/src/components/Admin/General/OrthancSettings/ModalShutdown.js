import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

import apis from '../../../../services/apis'

class ModalShutdown extends Component {

    shutdown = async () => {
        apis.options.shutdownOrthanc()
        this.props.onHide()
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Shutdown</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to shutdown Orthanc system ?</Modal.Body>
                <Modal.Footer>
                    <input type='button' className='btn btn-secondary' onClick={this.props.onHide} value="Close" />
                    <input type='button' className='btn btn-danger' onClick={this.shutdown} value="Shutdown" />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalShutdown;