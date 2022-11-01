import React from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import TagTable from '../CommonComponents/RessourcesDisplay/ReactTable/TagTable2'


export default ({
    show,
    onHide,
    data,
    level,
    onDataUpdate,
    defaultCheckedPrivateTags,
    onClickPrivateTags,
    defaultCheckedKeepSource,
    onClickKeepSource,
    modify
}) => {


    return (
        <Modal show={show} onHide={onHide} onClick={(e) => e.stopPropagation()} size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Modify {level}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TagTable data={data} onDataUpdate={onDataUpdate} />
                <div className='row'>
                    <div className='col-auto'>
                        <label htmlFor='removePrivateTags'>Removing private tags</label>
                    </div>
                    <div className='col-sm'>
                        <input className='form-check-input' type='checkbox'
                            defaultChecked={defaultCheckedPrivateTags}
                            onClick={onClickPrivateTags} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-auto'>
                        <label htmlFor='keepSource'>Keep Source</label>
                    </div>
                    <div className='col-sm'>
                        <input className='form-check-input' type='checkbox'
                            defaultChecked={defaultCheckedKeepSource}
                            onClick={onClickKeepSource} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='otjs-button otjs-button-orange me-5' onClick={modify}>Modify</Button>
                <Button className='otjs-button otjs-button-red' onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}
