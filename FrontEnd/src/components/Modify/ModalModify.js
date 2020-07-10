import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'


class ModalModify extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    columns = [
        {
            dataField: 'TagName', 
            text: 'Tag name', 
            sort: true, 
        },  {
            dataField: 'Value', 
            text: 'Value', 
            sort: true, 
        }
    ]

    selectRow = {
        mode: 'checkbox', 
        style: {background: 'red'}, 
        nonSelectable: ['PatientID', 'SeriesTime', 'SeriesDate', 'Modality', 'StudyDate', 'StudyTime'], 
        selectionRenderer: ({ mode, checked, disabled }) => {
            if (disabled) return 'Mendatory'
            else return <input type = 'checkbox'/>
        },
        selectColumnPosition: 'right', 
        selectionHeaderRenderer: () => {return 'Delete'}
    }
    
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Modify {this.props.level}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapTable 
                        ref={this.props.reference}
                        keyField='TagName' 
                        data={this.props.data} 
                        striped={true} 
                        columns={this.columns} 
                        wrapperClasses="table-responsive"
                        cellEdit={ cellEditFactory({ 
                            blurToSave: true,
                            autoSelectText: true,
                            mode: 'click',
                            nonEditableRows: () =>  this.props.level === 'studies' ? ['PatientID'] : [] ,
                            afterSaveCell: (oldValue, newValue, row, column) => {
                                this.props.afterSaveCell(oldValue, newValue, row, column)
                            }
                        }) }
                        selectRow={this.selectRow}
                    />
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='removePrivateTags'>Removing private tags</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox' defaultChecked={this.props.defaultCheckedPrivateTags} onClick={this.props.onClickPrivateTags} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='keepSource'>Keep Source</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox' defaultChecked={this.props.defaultCheckedKeepSource} onClick={this.props.onClickKeepSource} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='rememberSettings'>Remember Settings</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox' defaultChecked={this.props.defaultCheckedRemember} onClick={this.props.onClickRemember} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-info' onClick={this.props.onHide}>Cancel</button>
                    <button type='button' className='btn btn-warning' onClick={this.props.modify}>Modify</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalModify;