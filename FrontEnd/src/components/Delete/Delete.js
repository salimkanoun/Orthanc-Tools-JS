import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { toast } from 'react-toastify';
import { Row, Col} from 'react-bootstrap';

import { emptyDeleteList, removePatientFromDeleteList, removeStudyFromDeleteList } from '../../actions/DeleteList'
import apis from '../../services/apis'
import ModalDelete from '../Main/ModalDelete'
import MonitorTask from '../../tools/MonitorTask'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies';
import { studyArrayToPatientArray } from '../../tools/processResponse';

export default function Delete() {

    const [show, setShow] = useState(false)
    
    const store = useSelector(state => {
        return {
            deleteList: state.DeleteList.deleteList,
            username: state.OrthancTools.username
        }
    })

    const dispatch = useDispatch()

    let toastInstance = useRef(null)

    const toogleDeleteConfirmation = () => {
        setShow(show => (!show))
    }

    const openToast = () => {
        toastInstance = toast.info("Delete progress : 0%", { autoClose: false })
    }

    const updateToast = (progress) => {
        toast.update(toastInstance, { type: toast.TYPE.INFO, render: 'Delete progress : ' + Math.round(progress) + '%' })
    }

    const successToast = () => {
        toast.update(toastInstance, {
            type: toast.TYPE.INFO,
            render: 'Delete done',
            className: 'bg-success',
            autoClose: 2000
        })
    }

    const handleClickDelete = async () => {
        //close Modal
        toogleDeleteConfirmation()

        let deletedSeriesIdArray = []
        store.deleteList.forEach(study => {
            deletedSeriesIdArray.push(...study.SeriesOrthancIDs)
        })

        let answer

        try {
            answer = await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray, store.username)
        } catch (error) {
            toast.error(error.statusText)
            return
        }

        let task = new MonitorTask(answer, 2000)
        task.startMonitoringJob()

        openToast()

        task.onUpdate((info) => {
            updateToast(info.progress)
        })

        task.onFinish((info) => {
            successToast()

            store.deleteList.forEach(async (study) => {
                dispatch(removeStudyFromDeleteList(study.StudyID))
            })
        })


    }

    const handleClickEmpty = () => {
        dispatch(emptyDeleteList())
    }

    const onRemovePatient = (patientOrthancID) => {
        dispatch(removePatientFromDeleteList(patientOrthancID))
    }

    const onRemoveStudy = (studyOrthancID) => {
        dispatch(removeStudyFromDeleteList(studyOrthancID))
    }


    let patientRows = studyArrayToPatientArray(store.deleteList)
    console.log('patientRows : ',patientRows)
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
                        <button type="button" className="otjs-button otjs-button-orange w-7" onClick={handleClickEmpty}>Empty List
                        </button>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <TablePatientsWithNestedStudies
                            patients={patientRows}
                            removeRow
                            onRemovePatient={onRemovePatient}
                            onRemoveStudy={onRemoveStudy}
                            onSelectStudies={() => { }} />
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <button type="button" className="otjs-button otjs-button-red w-7" onClick={toogleDeleteConfirmation}>
                            Delete List
                        </button>
                    </Col>
                </Row>
            </Row>

            <ModalDelete show={show} onClickCancel={toogleDeleteConfirmation} onClickValidate={handleClickDelete} />
        </Fragment>

    )
}


