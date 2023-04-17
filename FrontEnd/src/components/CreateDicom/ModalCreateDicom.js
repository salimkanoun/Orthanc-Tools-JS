import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import CreateDicom from '../Import/CreateDicom'

export default ({show, onHide, OrthancID, level}) => {
        return (
            <Modal show={show} onHide={onHide} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Create Dicom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateDicom
                        OrthancID={OrthancID}
                        level={level}
                    />
                </Modal.Body>
            </Modal>
        )
}
