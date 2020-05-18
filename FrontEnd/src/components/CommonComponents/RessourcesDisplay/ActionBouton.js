import React, { Component, Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'
import { toastifySuccess, toastifyError } from '../../../services/toastify'
import OhifLink from '../../Ohif/OhifLink'
import Modal from 'react-bootstrap/Modal'
import TablePatients from './TablePatients'
import cellEditFactory from 'react-bootstrap-table2-editor'
import TableStudy from './TableStudy'

class ActionBouton extends Component{

    state = {
        show: '',
        modification: {}
    }

    constructor(props){
        super(props)
        this.modify = this.modify.bind(this)

        this.delete = this.delete.bind(this)
    }

    modify() {
        this.setState({modification: {}, show: this.props.level})
        
        this.setState({patient: true, modification: {}})
        console.log("Modify Call" + this.props.level +" ID "+ this.props.orthancID)
    }

    modifyPatient(){
        console.log(this.state.modification)
    }

    modifyStudy(){
        console.log(this.state.modification)
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

    render(){
        return (
            <Fragment>
                {/*Modal pour la modification patient*/}
                <Modal show={this.state.show === 'patient' ? true : false} onHide={() => this.setState({patient: false})}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TablePatients 
                        data={[this.props.row]} 
                        modify={true}
                        cellEdit={ cellEditFactory({ 
                            blurToSave: true,
                            autoSelectText: true,
                            mode: 'click', 
                            afterSaveCell: (oldValue, newValue, row, column) => {
                                console.log(column)
                                this.setState({modification: {...this.state.modification, [column.dataField]: newValue}})
                            }
                        }) }
                        wrapperClasses="table-responsive"/>
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-info' onClick={() => this.setState({show: ''})}>Cancel</button>
                    <button type='button' className='btn btn-warning' onClick={() => this.modifyPatient()}>Modify</button>
                </Modal.Footer>
                </Modal>

                {/*Modal pour la modification study*/}
                <Modal show={this.state.show === 'studies' ? true : false} onHide={() => this.setState({show: ''})}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableStudy 
                        data={[this.props.row]}
                        modify={true}
                        cellEdit={ cellEditFactory({ 
                            blurToSave: true,
                            autoSelectText: true,
                            mode: 'click', 
                            afterSaveCell: (oldValue, newValue, row, column) => {
                                console.log(column)
                                this.setState({modification: {...this.state.modification, [column.dataField]: newValue}})
                            }
                        })}
                        hiddenActionBouton={true}
                        wrapperClasses="table-responsive"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-info' onClick={() => this.setState({show: ''})}>Cancel</button>
                    <button type='button' className='btn btn-warning' onClick={() => this.modifyStudy()}>Modify</button>
                </Modal.Footer>
                </Modal>

                <Dropdown onClick={this.handleClick}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"  >
                        Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <OhifLink className='dropdown-item bg-info' {...this.props} />
                        <button className='dropdown-item bg-warning' type='button' onClick={ this.modify } >Modify</button>
                        <button className='dropdown-item bg-danger' type='button' onClick={ this.delete }>Delete</button>
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
            )
    }


}

export default ActionBouton