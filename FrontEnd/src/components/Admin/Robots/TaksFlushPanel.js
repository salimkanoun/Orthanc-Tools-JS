import { useState } from "react"
import { Modal, Row, Col, Button, Form } from 'react-bootstrap'

import apis from '../../../services/apis'

export default ({ }) => {

    const [flushType, setFlushType] = useState(null)

    const RETRIEVE = 'retrieve'
    const ANONYMIZE = 'anonymize'
    const DELETE = 'delete'
    const EXPORT = 'export'


    const handleClick = (type) => {
        setFlushType(type)
    }

    const handleConfirm = () => {
        switch (flushType) {
            case RETRIEVE:
                apis.retrieveRobot.flush();
                break;
            case ANONYMIZE:
                apis.anon.flush();
                break;
            case DELETE:
                apis.deleteRobot.flush();
                break;
            case EXPORT:
                apis.exportDicom.flushExternalExport();
                break;
            default:
                break;
        }
        setFlushType(null)
    }



    return (
        <Form>
            <h2 className="card-title">Flush task</h2>

            <Row>
                <Col>
                    <Form.Label>Flush anonymisation task : </Form.Label>
                    <Button className='otjs-button otjs-button-red' onClick={() => handleClick(ANONYMIZE)}> Flush </Button>
                </Col>
                <Col>
                    <Form.Label>Flush delete task : </Form.Label>
                    <Button className='otjs-button otjs-button-red' onClick={() => handleClick(DELETE)}> Flush </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>Flush export task : </Form.Label>
                    <Button className='otjs-button otjs-button-red' onClick={() => handleClick(EXPORT)}> Flush </Button>
                </Col>
                <Col>
                    <Form.Label>Flush retrieve task : </Form.Label>
                    <Button className='otjs-button otjs-button-red' onClick={() => handleClick(RETRIEVE)}> Flush </Button>
                </Col>
            </Row>

            <Modal show={!!flushType} onHide={() => setFlushType(null)} >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm flush</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Warning : there is no check on the flush for the progression of the task. It empties the queues without discrimination
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-info' onClick={() => setFlushType(null)}>Cancel</Button>
                    <Button className='btn btn-danger' onClick={handleConfirm}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}