import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { Container, Row } from 'react-bootstrap'

import MyRobotTable from './MyRobotTable'

import { addStudiesToAnonList } from '../../../actions/AnonList'
import { addStudiesToExportList } from '../../../actions/ExportList'
import { addStudiesToDeleteList } from '../../../actions/DeleteList'
import { errorMessage } from '../../../tools/toastify'
import apis from '../../../services/apis'

export default () => {

    const ITEM_FAILED = 'failed'

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
        }
    })

    const dispatch = useDispatch()

    const [id, setId] = useState(null)
    const [projectName, setProjectName] = useState(null)
    const [creator, setCreator] = useState(null)
    const [valid, setValid] = useState(null)
    const [approved, setApproved] = useState(null)
    const [rows, setRows] = useState([])
    const [selected, setSelected] = useState([])
    const [totalPercentageProgress, setTotalPercentageProgress] = useState(0)
    const [percentageFailure, setPercentageFailure] = useState(0)

    useEffect(() => {
        let interval = setInterval(refreshInfo, 2000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const refreshInfo = async () => {
        let retrieveIds = await apis.task.getTaskOfUser(store.username, 'retrieve')
        console.log(retrieveIds)
        if (retrieveIds.length > 0) {
            let response = await apis.task.getTask(retrieveIds[0]);
            refreshHandler(response)
        }
    }

    const refreshHandler = (response) => {

        let rowsRetrieveList = []

        let newPercentageFailure = 0

        response.details.items.forEach(item => {

            rowsRetrieveList.push({
                //Merge Modalities (study level) to modality column
                Modality: item.ModalitiesInStudy,
                id: item.AnswerNumber + ":" + item.AnswerId,
                ...item
            })

            if (item.Status === ITEM_FAILED) {
                ++newPercentageFailure;
            }
        });

        //SK CALCULER EN INSTANCE ET PAS EN STUDY (1 si pas d'info)
        newPercentageFailure = (newPercentageFailure / response.details.items.length) * 100

        let newTotalPercentageProgress = Math.round((newPercentageFailure + response.progress.retrieve + Number.EPSILON) * 10) / 10

        setValid(response.details.valid)
        setApproved(response.details.approved)
        setProjectName(response.details.projectName)
        setRows(rowsRetrieveList)
        setCreator(response.details.creator)
        setTotalPercentageProgress(newTotalPercentageProgress)
        setPercentageFailure(newPercentageFailure)
    }

    const getSelectedItemsStudiesDetails = async () => {

        //get array of selected rows
        let seletectedRows = selected

        let studyDataRetrieved = []
        //Loop each item to retrieve study level
        for (let row of seletectedRows) {
            await apis.content.getStudiesDetails(row.RetrievedOrthancId).then((studyDetails) => {
                studyDataRetrieved.push(studyDetails)
            }).catch((error) => {
                console.error(error)
            })
        }

        return studyDataRetrieved

    }

    const setSelect = (selected) => {
        setSelected({ selected })
    }

    const sendToAnon = async () => {
        let studyArray = await getSelectedItemsStudiesDetails()
        dispatch(addStudiesToAnonList(studyArray))
    }

    const sendToExport = async () => {
        let studyArray = await getSelectedItemsStudiesDetails()
        dispatch(addStudiesToExportList(studyArray))
    }

    const sendToDelete = async () => {
        let studyArray = await getSelectedItemsStudiesDetails()
        dispatch(addStudiesToDeleteList(studyArray))
    }

    const deleteQueryHandler = async (rowIndex) => {
        try {
            let row = rows[rowIndex];
            await apis.retrieveRobot.deleteRobotItem(id, row.id)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Delete Failed')
        }
    }

    const retryQueryHandler = async (rowIndex) => {
        try {
            let row = rows[rowIndex];
            await apis.retrieveRobot.retryRobotItem(id, row.id)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Retry Failed')
        }
    }


    return (
        <Container fluid>
            <Row>
                <h1 className="col"> Robot for user {creator}, project : {projectName} </h1>
                <div className="col-md-2 text-right">
                    <CircularProgressbarWithChildren
                        value={totalPercentageProgress}
                        text={`Progress : ${totalPercentageProgress}%`}
                        styles={buildStyles({
                            textSize: '10px'
                        })}
                    >
                        {/* Foreground path */}
                        <CircularProgressbar
                            value={percentageFailure}
                            styles={buildStyles({
                                trailColor: "transparent",
                                pathColor: "#f00"
                            })}
                        />
                    </CircularProgressbarWithChildren>
                </div>
            </Row>
            <Row className='mt-5'>
                <MyRobotTable rows={rows} />
            </Row>
        </Container>
    )
}

/*                <AnonExportDeleteSendButton onAnonClick={this.sendToAnon} onExportClick={this.sendToExport}
                    onDeleteClick={this.sendToDelete} />*/