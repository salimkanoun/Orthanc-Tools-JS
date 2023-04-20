import React, { Fragment, useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { Row, Col, Button } from "react-bootstrap"

import TableStudy from "../CommonComponents/RessourcesDisplay/ReactTable/TableStudy"
import apis from "../../services/apis"
import task from "../../services/task"
import MonitorTask from "../../tools/MonitorTask"


import { addStudiesToDeleteList } from "../../actions/DeleteList"
import { addStudiesToExportList } from "../../actions/ExportList"


export default ({ anonTaskID }) => {

    const [studies, setStudies] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        if (anonTaskID) {
            const getAnonTask = async () => { await task.getTask(anonTaskID) }
            let anonTask = getAnonTask()
            if (!!anonTask) {
                handleTask(anonTask);
                if (!["completed", "failed"].includes(anonTask.state)) {
                    this.monitor = new MonitorTask(anonTaskID, 4000);
                    this.monitor.onUpdate(handleTask.bind(this));
                    this.monitor.onFinish(() => {
                    });
                    this.monitor.startMonitoringJob();
                }
            }
        }
    }, [])

    useEffect(() => {
        if (this.monitor) this.monitor.stopMonitoringJob();
    }, [])


    const handleTask = async anonTask => {
        let studies = []
        for (const item of anonTask.details.items) {
            if (item.state === "completed") {
                try {
                    let study = await apis.content.getStudiesDetails(item.result)
                    let originalStudy = await apis.content.getStudiesDetails(study.AnonymizedFrom)
                    studies.push({
                        ...study,
                        ...study.MainDicomTags,
                        ...study.PatientMainDicomTags,
                        StudyOrthancID: study.ID,
                        AnonymizedFrom: study.AnonymizedFrom,
                        OriginalPatientName: originalStudy.PatientMainDicomTags.PatientName,
                        OriginalPatientID: originalStudy.PatientMainDicomTags.PatientID,
                        OriginalAccessionNumber: originalStudy.MainDicomTags.AccessionNumber,
                        OriginalStudyDate: originalStudy.MainDicomTags.StudyDate,
                        OriginalStudyInstanceUID: originalStudy.MainDicomTags.StudyInstanceUID,
                        OriginalStudyDescription: originalStudy.MainDicomTags.StudyDescription,
                        newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '',
                        newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
                    })
                } catch (err) {
                }

            }
        }
        setStudies(studies)
    }

    const getCSV = () => {
        //Level study ou series
        //Get le anonymized from pour le level study
    }

    const removeStudyAnonymized = (studyID) => {
        apis.content.deleteStudies(studyID)
    }

    const exportList = () => {
        dispatch(addStudiesToExportList(studies))
    }

    const deleteList = () => {
        dispatch(addStudiesToDeleteList(studies))
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <TableStudy
                        studies={studies}
                        hiddenActionBouton={true}
                        hiddenRemoveRow={false}
                        onDelete={removeStudyAnonymized}
                        hiddenName={false}
                        hiddenID={false}
                        pagination={true}
                        hiddenCSV={false}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Button className='otjs-button otjs-button-blue w-10 me-4' onClick={exportList}>
                        To Export List
                    </Button>
                    <Button className='otjs-button otjs-button-red w-10 ms-4' onClick={deleteList}>
                        To Delete List
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )

}