import React, { Component, Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'
import { toastifySuccess, toastifyError } from '../../../services/toastify'
import OhifLink from '../../Ohif/OhifLink'
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'
import Metadata from '../../Metadata/Metadata'

class ActionBouton extends Component{

    state = {
        showModify: false,
        showMetadata: false, 
        data: [], 
        modification: {}
    }

    constructor(props){
        super(props)
        this.openModify = this.openModify.bind(this)
        this.onHide = this.onHide.bind(this)
        this.delete = this.delete.bind(this)
        this.setMetadata = this.setMetadata.bind(this)
    }

    static defaultProps = {
        hiddenMetadata: true
    }

    openModify() {
        this.setState({modification: {}, showModify: true, removePrivateTags: false})
        let rows=[]
        let forbidden = ['studies', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in this.props.row){
            if (!forbidden.includes(tag))
                rows.push({'TagName': tag, 'Value': this.props.row[tag] ? this.props.row[tag] : ''})
        }
        this.setState({data: rows})
    }

    setMetadata(){
        this.setState({
            showMetadata: !this.state.showMetadata
        })
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
            showModify: false
        })
    }

    async delete( ) {
        let orthancID = this.props.orthancID
        switch(this.props.level){
            case 'patient':
                await apis.content.deletePatient(orthancID)
                toastifySuccess("Patient " + orthancID + " have been deleted")
                break
            case 'studies':
                await apis.content.deleteStudies(orthancID)
                toastifySuccess("Studies " + orthancID + " have been deleted")
                break
            case 'series':
                await apis.content.deleteSeries(orthancID)
                toastifySuccess("Series " + orthancID + " have been deleted")
                break
            default:
                toastifyError("Wrong level")
        }
        this.props.onDelete(orthancID, this.props.parentID)
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

    render(){
        console.log(this.props.hiddenMetadata)
        return (
            <Fragment>
                {/*Modal pour la modification*/}
                <Modal show={this.state.showModify} onHide={this.onHide} onClick={this.handleClick} size='xl'>
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

                {/*modal pour metadata*/}
                <Modal show={this.state.showMetadata} onHide={this.setMetadata}>
                    <Modal.Header closeButton>
                        <Modal.Title>Metadata</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Metadata serieID={this.props.orthancID} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-primary' onClick={this.setMetadata} >OK</button>
                    </Modal.Footer>
                </Modal>

                <Dropdown onClick={this.handleClick}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"  >
                        Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <OhifLink className='dropdown-item bg-info' {...this.props} />
                        <button className='dropdown-item bg-warning' type='button' onClick={ this.openModify } >Modify</button>
                        <button className='dropdown-item bg-danger' type='button' onClick={ this.delete }>Delete</button>
                        <button className='dropdown-item bg-info' type='button' onClick={ this.setMetadata} hidden={this.props.hiddenMetadata}>Metadata</button>
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
            )
    }


}

export default ActionBouton