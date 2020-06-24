import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'

import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { removePatientFromDeleteList, removeStudyFromDeleteList, emptyDeleteList } from '../../actions/DeleteList'
import { removeOrthancContentStudy } from '../../actions/OrthancContent'
import {studyArrayToPatientArray} from '../../tools/processResponse'
import Modal from 'react-bootstrap/Modal'
import apis from '../../services/apis'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    constructor(props){
        super(props)
        this.handleClickEmpty = this.handleClickEmpty.bind(this)
        this.handleClickDelete = this.handleClickDelete.bind(this)
        this.onDeletePatient = this.onDeletePatient.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }

    handleConfirm(){
        this.props.onHide()
        this.props.setConfirm()
    }

    //SK Ici laisser l'action au front et gérer un retour visuel, je m'occuperai du back
    async handleClickDelete(){
        //close Modal
        this.handleConfirm()
        //call API DELETE
        let deletedSeriesIdArray = this.props.deleteList.map(deleteObject => {
            return deleteObject.Series[0]
        })
        console.log(deletedSeriesIdArray)
        await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray)

        //A GERER LE FLUSH DE LA LISTE DU COUP
        //La liste des delete elle etait bien au niveau Series non ?
        this.props.deleteList.forEach(async (study) => {
            this.props.removeStudyFromDeleteList(study.ID)
            this.props.removeOrthancContentStudy(study.ID)
        });

    }

    handleClickEmpty(){
        this.props.emptyDeleteList()
    }

    //SK : Ici on avait deja defini des listener onDelete pour le dropdown, je les ai reutillise pour
    //le boutton delete de la row
    onDeletePatient(patientOrthancID){
        this.props.removePatientFromDeleteList(patientOrthancID)
    }

    onDeleteStudy(studyOrthancID){
        this.props.removeStudyFromDeleteList(studyOrthancID)
    }
    
    render(){
        return (
            <Fragment>
                <Overlay target={this.props.target} show={this.props.show} placement="left" onHide={this.props.onHide} rootClose >
                    <Popover id="popover-basic" style={ { maxWidth : '100%' }} >
                        <Popover.Title as="h3">Delete List</Popover.Title>
                        <Popover.Content>
                            <div className="float-right mb-3">
                                <button type="button" className="btn btn-warning" onClick={this.handleClickEmpty} >Empty List</button>
                            </div>
                            <TablePatientsWithNestedStudies 
                                patients={studyArrayToPatientArray(this.props.deleteList)} 
                                hiddenActionBouton={true} 
                                hiddenRemoveRow={false} 
                                onDeletePatient={this.onDeletePatient} 
                                onDeleteStudy={this.onDeleteStudy}
                                wrapperClasses="table-responsive" />
                            <div className="text-center">
                                <button type="button" className="btn btn-danger" onClick={this.handleConfirm} >Delete List</button>
                            </div>
                        </Popover.Content>
                    </Popover>
                </Overlay>
                <Modal show={this.props.confirmDelete} onHide={this.handleConfirm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure to Delete the list</Modal.Body>
                    <Modal.Footer>
                        <input type='button' className='btn btn-secondary' onClick={this.handleConfirm} value="Cancel" />
                        <input type='button' className='btn btn-danger' onClick={this.handleClickDelete} value="Delete" />
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList
    }
}

const mapDispatchToProps = {
    removePatientFromDeleteList, 
    removeStudyFromDeleteList,
    emptyDeleteList, 
    removeOrthancContentStudy
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTool)