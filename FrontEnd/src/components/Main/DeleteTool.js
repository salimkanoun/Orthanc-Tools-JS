import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'
import {toast} from 'react-toastify';

import TablePatientsWithNestedStudies
    from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'

import {emptyDeleteList, removePatientFromDeleteList, removeStudyFromDeleteList} from '../../actions/DeleteList'
import apis from '../../services/apis'
import ModalDelete from './ModalDelete';
import MonitorTask from '../../tools/MonitorTask';

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    handleConfirm = () => {
        this.props.onHide()
        this.props.setConfirm()
    }

    openToast = () => {
        this.toast = toast.info("Delete progress : 0%", {autoClose: false})
    }

    updateToast = (progress) => {
        toast.update(this.toast, {type: toast.TYPE.INFO, render: 'Delete progress : ' + Math.round(progress) + '%'})
    }

    successToast = () => {
        toast.update(this.toast, {
            type: toast.TYPE.INFO,
            render: 'Delete done',
            className: 'bg-success',
            autoClose: 2000
        })
    }

    handleClickDelete = async () => {
        //close Modal
        this.handleConfirm()

        let deletedSeriesIdArray = []
        this.props.deleteList.forEach((item) => {
            deletedSeriesIdArray = [...deletedSeriesIdArray, ...item.Series]
        })

        let answer
        try {
            answer = await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray, this.props.username)
        } catch (error) {
            toast.error(error.statusText)
            return
        }
        if (answer) {
            this.task = new MonitorTask(answer, 2000)
            this.task.startMonitoringJob()

            this.openToast()

            this.task.onUpdate((info) => {
                this.updateToast(info.progress)
            })

            this.task.onFinish((info) => {
                this.successToast()

                this.props.deleteList.forEach(async (study) => {
                    this.props.removeStudyFromDeleteList(study.ID)
                });
            })
        }

    }

    handleClickEmpty = () => {
        this.props.emptyDeleteList()
    }

    onDeletePatient = (patientOrthancID) => {
        this.props.removePatientFromDeleteList(patientOrthancID)
    }

    onDeleteStudy = (studyOrthancID) => {
        this.props.removeStudyFromDeleteList(studyOrthancID)
    }

    render = () => {
        return (
            <Fragment>
                <Overlay target={this.props.target} show={this.props.show} placement="bottom" onHide={this.props.onHide}
                         rootClose>
                    <Popover id="popover-basic" style={{maxWidth: '100%'}}>
                        <Popover.Header as="h3">Delete List</Popover.Header>
                        <Popover.Body>
                            <div className="float-right mb-3">
                                <button type="button" className="btn btn-warning" onClick={this.handleClickEmpty}>Empty
                                    List
                                </button>
                            </div>
                            <TablePatientsWithNestedStudies
                                studies={this.props.deleteList}
                                hiddenActionBouton={true}
                                hiddenRemoveRow={false}
                                hiddenSelect={true}
                                onDeletePatient={this.onDeletePatient}
                                onDeleteStudy={this.onDeleteStudy}
                                wrapperClasses="table-responsive"/>
                            <div className="text-center">
                                <button type="button" className="btn btn-danger" onClick={this.handleConfirm}>Delete
                                    List
                                </button>
                            </div>
                        </Popover.Body>
                    </Popover>
                </Overlay>
                <ModalDelete show={this.props.confirmDelete} onHide={this.handleConfirm}
                             onClick={this.handleClickDelete}/>
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
    emptyDeleteList
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTool)