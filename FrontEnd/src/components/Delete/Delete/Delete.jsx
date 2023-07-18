import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Button, Container } from 'react-bootstrap';

import TableDelete from './TableDelete'

import { emptyDeleteList } from '../../../actions/DeleteList'
import { confirm } from '../../CommonComponents/ConfirmGlobal'
import { errorMessage, successMessage } from '../../../tools/toastify'
import { studyArrayToPatientArray } from '../../../tools/processResponse';
import apis from '../../../services/apis'

export default () => {

    const dispatch = useDispatch()

    const deleteList = useSelector(state =>state.DeleteList.deleteList)
    const username = useSelector(state =>state.OrthancTools.username)

    const handleClickDelete = async () => {
        const validation = await confirm({ title: 'Delete', message: 'Do you want to delete these ressources ?' })
        if (validation) {
            let deletedSeriesIdArray = []
            deleteList.forEach(study => {
                deletedSeriesIdArray.push(...study.SeriesOrthancIDs)
            })

            try {
                await apis.deleteRobot.createDeleteRobot(deletedSeriesIdArray, username)
                successMessage('Delete started')
                handleClickEmpty()
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
        <Container fluid>
            <Row>
                <Row className="d-flex justify-content-end mt-5">
                    <Button className="otjs-button otjs-button-orange w-7" onClick={handleClickEmpty}>
                        Empty List
                    </Button>
                </Row>
                <Row className="mt-5">
                    <TableDelete patientRows={studyArrayToPatientArray(deleteList)} />
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className="otjs-button otjs-button-red w-7"
                        onClick={handleClickDelete}>
                        Delete List
                    </Button>
                </Row>
            </Row>
        </Container>
    )
}


