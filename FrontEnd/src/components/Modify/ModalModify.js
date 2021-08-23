import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import {TagTable} from "../CommonComponents/RessourcesDisplay/ReactTable/TagTable";


export default class ModalModify extends Component {

    render = () => {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Modify {this.props.level}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TagTable data={this.props.data} onDataUpdate={this.props.onDataUpdate}/>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='removePrivateTags'>Removing private tags</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox'
                                   defaultChecked={this.props.defaultCheckedPrivateTags}
                                   onClick={this.props.onClickPrivateTags}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='keepSource'>Keep Source</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox'
                                   defaultChecked={this.props.defaultCheckedKeepSource}
                                   onClick={this.props.onClickKeepSource}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='otjs-button otjs-button-orange me-5' onClick={this.props.modify}>Modify</button>
                    <button type='button' className='otjs-button otjs-button-red' onClick={this.props.onHide}>Cancel</button>
                </Modal.Footer>
            </Modal>
        )
    }
}
