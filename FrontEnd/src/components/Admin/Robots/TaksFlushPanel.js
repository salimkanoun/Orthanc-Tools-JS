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
                <h2 className="card-title">Tác vụ dọn dẹp</h2>
                <Row className="mt-4 align-items-center text-start">
                    <Col sm={3}>
                        <p>Dọn dẹp tác vụ ẩn danh: </p> 
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('anonymize')} value='Dọn dẹp' />
                    </Col>
                    <Col sm={3}>
                        <p>Dọn dẹp tác vụ xóa : </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('delete')} value='Dọn dẹp' />
                    </Col>
                </Row>
                <Row className="mt-4 align-items-center text-start">
                    <Col sm={3}>
                        <p>Dọn dẹp tác vụ xuất : </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('export')} value='Dọn dẹp' />
                    </Col>
                    <Col sm={3}>
                        <p>Dọn dẹp tác vụ truy xuất: </p>
                    </Col>
                    <Col sm={3}>
                        <input type='button' className='otjs-button otjs-button-red' onClick={()=>this.handleClick('retrieve')} value='Dọn dẹp' />
                    </Col>
                </Row>
                <Modal show={!!this.state.flushType} onHide={()=>this.setState({flushType:null})} >
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Cảnh báo: không có kiểm tra về tiến độ của các tác vụ. It empties the queues without discrimination
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={()=>this.setState({flushType:null})}>Đóng</button>
                        <button type='button' className='btn btn-danger' onClick={this.handleConfirm}>Xác nhận</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}