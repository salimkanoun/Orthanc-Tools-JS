import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap';

import TableDelete from './TableDelete'

import { emptyDeleteList } from '../../actions/DeleteList'
import { confirm } from '../CommonComponents/ConfirmGlobal'
import { errorMessage, robotMessageToNotificationCenter, successMessage } from '../../tools/toastify'
import { studyArrayToPatientArray } from '../../tools/processResponse';
import apis from '../../services/apis'

export default () => {

    const dispatch = useDispatch()
    const store = useSelector(state => {
        return {
            deleteList: state.DeleteList.deleteList,
            username: state.OrthancTools.username
        }
    })

    const handleClickDelete = async () => {
        const validation = await confirm({ title: 'Delete', message: 'Do you want to delete these ressources ?' })
        if (validation) {
            let deletedSeriesIdArray = []
            store.deleteList.forEach(study => {
                deletedSeriesIdArray.push(...study.SeriesOrthancIDs)
            })

            try {
                let jobId = await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray, store.username)
                successMessage('Delete processing see notification center')
                handleClickEmpty()
                robotMessageToNotificationCenter('Delete', { ID: jobId, length: deletedSeriesIdArray.length })
            } catch (error) {
                errorMessage(error?.data?.errorMessage ?? "Error Creating Deletion Robot")
                return
            }

        }

    }

    const handleClickEmpty = () => {
        dispatch(emptyDeleteList())
    }

    return (
        <Fragment>
            <Row>
                <Row className="border-bottom border-2 pb-3">
                    <Col className="d-flex justify-content-start align-items-center">
                        <i className="fas fa-trash-alt ico me-3"></i>
                        <h2 className="card-title">Delete</h2>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-end mt-5">
                    <Button className="otjs-button otjs-button-orange w-7" onClick={handleClickEmpty}>
                        Empty List
                    </Button>
                </Row>
                <Row className="mt-5">
                    <TableDelete patientRows={studyArrayToPatientArray(store.deleteList)} />
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className="otjs-button otjs-button-red w-7"
                        onClick={handleClickDelete}>
                        Delete List
                    </Button>
                </Row>
            </Row>
        </Fragment>
    )
}


