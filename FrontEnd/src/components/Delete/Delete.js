import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {toast} from 'react-toastify';
import { Row, Col } from 'react-bootstrap';

import TablePatientsWithNestedStudies
    from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'

import {emptyDeleteList, removePatientFromDeleteList, removeStudyFromDeleteList} from '../../actions/DeleteList'
import apis from '../../services/apis'
import ModalDelete from '../Main/ModalDelete'
import MonitorTask from '../../tools/MonitorTask'

class Delete extends Component {

    state = {
        show: false
    }

    handleConfirm = () => {
        this.setState(prevState => ({
            show: !prevState.show
        }))
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
            })
        })


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
                <Row>
                    <Row className="border-bottom border-2 pb-3">
                        <Col className="d-flex justify-content-start align-items-center">
                            <i className="fas fa-trash-alt ico me-3"></i><h2 className="card-title">Delete</h2>
                        </Col>
                    </Row>
                    <Row className="text-start mt-5">
                        <Col>
                            <button type="button" className="otjs-button otjs-button-orange w-7" onClick={this.handleClickEmpty}>Empty List
                            </button>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col>
                            <TablePatientsWithNestedStudies
                                studies={this.props.deleteList}
                                hiddenActionBouton={true}
                                hiddenSelect={true}
                                hiddenRemoveRow={false}
                                onDeletePatient={this.onDeletePatient}
                                onDeleteStudy={this.onDeleteStudy}
                                wrapperClasses="table-responsive"/>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col>
                            <button type="button" className="otjs-button otjs-button-red w-7" onClick={this.handleConfirm}>
                                Delete List
                            </button>
                        </Col>
                    </Row>
                </Row>
                   
                <ModalDelete show={this.state.show} onHide={this.handleConfirm} onClick={this.handleClickDelete}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Delete)