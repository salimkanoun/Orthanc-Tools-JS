import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'
import { toast } from 'react-toastify';

import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { removePatientFromDeleteList, removeStudyFromDeleteList, emptyDeleteList } from '../../actions/DeleteList'
import { removeOrthancContentStudy } from '../../actions/OrthancContent'
import {studyArrayToPatientArray} from '../../tools/processResponse'
import apis from '../../services/apis'
import ModalDelete from './ModalDelete';
import MonitorTask from '../../tools/MonitorTask';

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {


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
        this.props.onHide()
        this.props.setConfirm()
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
            this.task = new MonitorTask(answer.id, 2000)
            this.task.startMonitoringJob()

            this.openToast()

            this.task.onUpdate((info)=>{
                this.updateToast(info.progress)
            })

            this.task.onFinish((info)=>{
                this.successToast()
                
                this.props.deleteList.forEach(async (study) => {
                    this.props.removeStudyFromDeleteList(study.ID)
                    this.props.removeOrthancContentStudy(study.ID)
                });
            })
        }

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
                <ModalDelete show={this.props.confirmDelete} onHide={this.handleConfirm} onClick={this.handleClickDelete} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTool)