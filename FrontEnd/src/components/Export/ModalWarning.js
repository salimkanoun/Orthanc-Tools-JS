import React from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

export default ({ show, onHide, button }) => {

    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title>Confirm export</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Some studies are not anonymized !
            </Modal.Body>
            <Modal.Footer>
                <Button className='otjs-button otjs-button-red' onClick={onHide}>Cancel</Button>
                {button}
            </Modal.Footer>
        </Modal>
    )

}