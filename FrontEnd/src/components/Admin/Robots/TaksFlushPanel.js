import { Component, Fragment } from "react"
import apis from '../../../services/apis'
import {Modal, Row, Col} from 'react-bootstrap'

export default class RobotStatus extends Component {
    state = {
        flushType: null
    }
    
    handleClick = (type)=>{
        this.setState({
            flushType : type
        })
    }

    handleConfirm = ()=>{
        switch (this.state.flushType) {
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
        this.setState({flushType:null});
    }

    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Flush task</h2>
                <Row className="mt-4 align-items-center text-start">
                    <Col sm={3}>
                        <p>Flush anonymisation task : </p> 
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('anonymize')} value='Flush' />
                    </Col>
                    <Col sm={3}>
                        <p>Flush delete task : </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('delete')} value='Flush' />
                    </Col>
                </Row>
                <Row className="mt-4 align-items-center text-start">
                    <Col sm={3}>
                        <p>Flush export task : </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('export')} value='Flush' />
                    </Col>
                    <Col sm={3}>
                        <p>Flush retrieve task : </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('retrieve')} value='Flush' />
                    </Col>
                </Row>
                <Modal show={!!this.state.flushType} onHide={()=>this.setState({flushType:null})} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm flush</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Warning : there is no check on the flush for the progression of the task. It empties the queues without discrimination
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={()=>this.setState({flushType:null})}>Cancel</button>
                        <button type='button' className='btn btn-danger' onClick={this.handleConfirm}>Confirm</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}