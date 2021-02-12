import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

export default class ModalDelete extends Component {

    render = () => {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to Delete the list</Modal.Body>
                <Modal.Footer>
                    <input type='button' className='btn btn-secondary' onClick={this.props.onHide} value="Cancel" />
                    <input type='button' className='btn btn-danger' onClick={this.props.onClick} value="Delete" />
                </Modal.Footer>
            </Modal>
        );
    }
}