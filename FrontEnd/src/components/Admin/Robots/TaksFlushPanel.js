import { Component, Fragment } from "react"
import apis from '../../../services/apis'
import Modal from 'react-bootstrap/Modal'

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
                <div className="grid-button-group">
                    <p>Flush anonymisation task : </p> 
                    <input type='button' className='row btn btn-danger' onClick={()=>this.handleClick('anonymize')} value='flush' />
                    <p>Flush delete task : </p>
                    <input type='button' className='row btn btn-danger' onClick={()=>this.handleClick('delete')} value='flush' />
                    <p>Flush export task : </p>
                    <input type='button' className='row btn btn-danger' onClick={()=>this.handleClick('export')} value='flush' />
                    <p>Flush retrieve task : </p>
                    <input type='button' className='row btn btn-danger' onClick={()=>this.handleClick('retrieve')} value='flush' />
                </div>
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