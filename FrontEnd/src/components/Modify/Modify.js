import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import apis from '../../services/apis';
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'
import { toastifyError } from '../../services/toastify';

class Modify extends Component {
    state = { 
        show: false, 
        modification: {}
     }

     constructor(props){
        super(props)
        this.openModify = this.openModify.bind(this)
        this.onHide = this.onHide.bind(this)
    }

     openModify() {
        this.setState({modification: {}, show: true, removePrivateTags: false})
        let rows=[]
        let forbidden = ['studies', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in this.props.row){
            if (!forbidden.includes(tag))
                rows.push({'TagName': tag, 'Value': this.props.row[tag] ? this.props.row[tag] : ''})
        }
        this.setState({data: rows})
    }
    
    async modify(){
        switch(this.props.level){
            case 'patient':
                if (!this.state.modification.PatientID || this.state.modification.PatientID === '')
                    alert('PatientID can\'t be empty or the same as before!')
                else {
                    await apis.content.modifyPatients(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags)
                    this.props.refresh()
                    this.onHide()
                }
                break
            case 'studies':
                await apis.content.modifyStudy(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags)
                this.props.refresh()
                this.onHide()
                break
            case 'series':
                await apis.content.modifySeries(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags)
                this.props.refreshSerie() //Warning in the console cf ContentRootPanel function refreshSerie() line 50
                this.onHide()
                break
            default:
                toastifyError("Wrong level")
        }
    }

    onHide(){
        this.setState({
            show: false
        })
    }

    handleClick(e){
        e.stopPropagation()
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
            <Fragment>
                <button className='dropdown-item bg-warning' type='button' onClick={ this.openModify } >Modify</button>

                <Modal show={this.state.show} onHide={this.onHide} onClick={this.handleClick} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify {this.props.level}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BootstrapTable 
                            ref={n => this.node = n}
                            keyField='TagName' 
                            data={this.state.data} 
                            striped={true} 
                            columns={this.columns} 
                            wrapperClasses="table-responsive"
                            cellEdit={ cellEditFactory({ 
                                blurToSave: true,
                                autoSelectText: true,
                                mode: 'click',
                                nonEditableRows: () =>  this.props.level === 'studies' ? ['PatientID'] : [] ,
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.setState({
                                        modification: {
                                            ...this.state.modification, 
                                            [row.TagName]: row.Value
                                        }
                                    })
                                }
                            }) }
                            selectRow={this.selectRow}
                        />
                        <label htmlFor='removePrivateTags mr-3'>Removing private tags</label>
                        <input className='form-check-input ml-3' type='checkbox' onClick={() => this.setState({removePrivateTags: !this.state.removePrivateTags})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={this.onHide}>Cancel</button>
                        <button type='button' className='btn btn-warning' onClick={() => this.modify()}>Modify</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default Modify;