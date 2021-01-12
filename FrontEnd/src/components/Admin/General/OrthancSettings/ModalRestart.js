import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

import apis from '../../../../services/apis'

class ModalRestart extends Component {

    reset = async () => {
        apis.options.resetOrthanc()
        this.props.onHide()
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm restart</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to restart Orthanc system ?</Modal.Body>
                <Modal.Footer>
                    <input type='button' className='btn btn-secondary' onClick={this.props.onHide} value="Close" />
                    <input type='button' className='btn btn-warning' onClick={this.reset} value="Restart" />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalRestart;