import React, { Component } from 'react'
import { connect } from 'react-redux'
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'

import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { removePatientFromDeleteList, removeStudyFromDeleteList, emptyDeleteList } from '../../actions/DeleteList'
import { removeOrthancContent } from '../../actions/OrthancContent'
import {studyArrayToPatientArray} from '../../tools/processResponse'
import Modal from 'react-bootstrap/Modal'
import apis from '../../services/apis'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    state = {show: false}

    constructor(props){
        super(props)
        this.handleClickEmpty = this.handleClickEmpty.bind(this)
        this.handleClickDelete = this.handleClickDelete.bind(this)
        this.onDeletePatient = this.onDeletePatient.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }

    handleConfirm(){
        this.setState({
            show: !this.state.show
        })
    }

    //SK Ici laisser l'action au front et gérer un retour visuel, je m'occuperai du back
     handleClickDelete(){
        //close Modal
        this.handleConfirm()
        //call API DELETE
        console.log(this.props.deleteList)
        this.props.deleteList.forEach(async (study) => {
            console.log("Will delete : ", study.ID)
            await apis.content.deleteStudies(study.ID) //take a lot of time, need to pass by the back
            this.props.removeStudyFromDeleteList(study.ID)
            this.props.removeOrthancContent(study.ID)
           
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
            //La position ne suit pas y a une histoire de Ref https://react-bootstrap.github.io/components/overlays/
            //https://github.com/react-bootstrap/react-bootstrap/issues/2208
            <Overlay target={this.props.target} show={this.props.show} placement="bottom" >
                <Popover id="popover-basic" style={ { maxWidth : '100%'}} >
                    <Popover.Title as="h3">Delete List</Popover.Title>
                    <Popover.Content>
                        <div className="float-right mb-3">
                            <button type="button" className="btn btn-warning" onClick={this.handleClickEmpty} >Empty List</button>
                        </div>
                        <TablePatientsWithNestedStudies patients={studyArrayToPatientArray(this.props.deleteList)} hiddenActionBouton={true} hiddenRemoveRow={false} onDeletePatient={this.onDeletePatient} onDeleteStudy={this.onDeleteStudy} />
                        <div className="text-center">
                            <button type="button" className="btn btn-danger" onClick={this.handleConfirm} >Delete List</button>
                            <Modal show={this.state.show} onHide={this.handleConfirm}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Delete</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure to Delete the list</Modal.Body>
                                <Modal.Footer>
                                    <input type='button' className='btn btn-secondary' onClick={this.handleConfirm} value="Cancel" />
                                    <input type='button' className='btn btn-danger' onClick={this.handleClickDelete} value="Delete" />
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </Popover.Content>
                </Popover>
            </Overlay>
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
    removeOrthancContent
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTool)