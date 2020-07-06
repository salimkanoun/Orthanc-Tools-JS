import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify';

import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { removePatientFromDeleteList, removeStudyFromDeleteList, emptyDeleteList } from '../../actions/DeleteList'
import { removeOrthancContentStudy } from '../../actions/OrthancContent'
import {studyArrayToPatientArray} from '../../tools/processResponse'
import Modal from 'react-bootstrap/Modal'
import apis from '../../services/apis'

class Delete extends Component {

    state = {
        show: false
    }


    constructor(props){
        super(props)
        this.handleClickEmpty = this.handleClickEmpty.bind(this)
        this.handleClickDelete = this.handleClickDelete.bind(this)
        this.onDeletePatient = this.onDeletePatient.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.toast = React.createRef(null)
    }

    handleConfirm(){
        this.setState(prevState => ({
            show: !prevState.show
        }))
    }
    
    openToast(){
        this.toast.current = toast("Delete progress : 0%", { autoClose: false})
    }

    updateToast(progress){
        toast.update(this.toast.current, {type: toast.TYPE.INFO, render: 'Delete progress : ' + progress + '%'})
    }

    successToast(){
        toast.update(this.toast.current, {type: toast.TYPE.INFO, render: 'Delete done', className: 'bg-success', autoClose: 2000})
    }

    startMonitoring(){
        this.openToast()
        this.intervalChcker = setInterval(() => this.getInfo(), 2000)
    }

    stopMonitoring(){
        if(this.intervalChcker !== undefined) clearInterval(this.intervalChcker)
        this.successToast()
        this.props.deleteList.forEach(async (study) => {
            this.props.removeStudyFromDeleteList(study.ID)
            this.props.removeOrthancContentStudy(study.ID)
        });
    }

    async getInfo(){
        let progress = await apis.deleteRobot.getDeleteRobot(this.props.username)
        let nb = 100*progress.progression.Success/progress.items.length
        this.updateToast(nb)
        if(progress.status === 'Finished') {this.stopMonitoring()}
    }

    async handleClickDelete(){
        //close Modal
        this.handleConfirm()
        //call API DELETE

        let deletedSeriesIdArray = []
        this.props.deleteList.forEach((item) => {
            deletedSeriesIdArray = [...deletedSeriesIdArray, ...item.Series]
        })
        
        let answer = await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray, this.props.username)
        if (answer){
            this.startMonitoring()
        }

    }

    handleClickEmpty(){
        this.props.emptyDeleteList()
    }

    onDeletePatient(patientOrthancID){
        this.props.removePatientFromDeleteList(patientOrthancID)
    }

    onDeleteStudy(studyOrthancID){
        this.props.removeStudyFromDeleteList(studyOrthancID)
    }
    
    render(){
        return (
            <Fragment>
                <div className='jumbotron'>
                    <h2 className="card-title mb-3">Delete</h2>
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
                </div>
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
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList, 
        username: state.OrthancTools.username
    }
}

const mapDispatchToProps = {
    removePatientFromDeleteList, 
    removeStudyFromDeleteList,
    emptyDeleteList, 
    removeOrthancContentStudy
}

export default connect(mapStateToProps, mapDispatchToProps)(Delete)