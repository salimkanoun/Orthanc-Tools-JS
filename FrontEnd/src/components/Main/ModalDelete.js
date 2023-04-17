import React from 'react'
import Modal from 'react-bootstrap/Modal'

export default ({ show, onClickCancel, onClickValidate }) => {

    return (
        <Modal show={show} onHide={onClickCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to Delete the list</Modal.Body>
            <Modal.Footer>
                <input type='button' className='btn btn-secondary' onClick={onClickCancel} value="Cancel" />
                <input type='button' className='btn btn-danger' onClick={onClickValidate} value="Delete" />
            </Modal.Footer>
        </Modal>
    )

}