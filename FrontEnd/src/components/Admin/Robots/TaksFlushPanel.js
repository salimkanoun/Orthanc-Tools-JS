import { Fragment, useState } from "react"
import apis from '../../../services/apis'
import { Modal, Row, Col, Button } from 'react-bootstrap'

export default ({ }) => {

    const [flushType, setFlushType] = useState(null)

    const handleClick = (type) => {
        setFlushType(type)
    }

    const handleConfirm = () => {
        switch (flushType) {
            case 'retrieve':
                apis.retrieveRobot.flush();
                break;
            case 'anonymize':
                apis.anon.flush();
                break;
            case 'delete':
                apis.deleteRobot.flush();
                break;
            case 'export':
                apis.exportDicom.flushExternalExport();
                break;
            default:
                break;
        }
        setFlushType(null)
    }

    return (
        <Fragment>
            <h2 className="card-title">Flush task</h2>
            <Row className="mt-4 align-items-center text-start">
                <Col sm={3}>
                    <p>Flush anonymisation task : </p>
                </Col>
                <Col sm={3}>
                    <input type='button' className='otjs-button otjs-button-red' onClick={() => handleClick('anonymize')} value='Flush' />
                </Col>
                <Col sm={3}>
                    <p>Flush delete task : </p>
                </Col>
                <Col sm={3}>
                    <input type='button' className='otjs-button otjs-button-red' onClick={() => handleClick('delete')} value='Flush' />
                </Col>
            </Row>
            <Row className="mt-4 align-items-center text-start">
                <Col sm={3}>
                    <p>Flush export task : </p>
                </Col>
                <Col sm={3}>
                    <input type='button' className='otjs-button otjs-button-red' onClick={() => handleClick('export')} value='Flush' />
                </Col>
                <Col sm={3}>
                    <p>Flush retrieve task : </p>
                </Col>
                <Col sm={3}>
                    <input type='button' className='otjs-button otjs-button-red' onClick={() => handleClick('retrieve')} value='Flush' />
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
        </Fragment>
    )
}