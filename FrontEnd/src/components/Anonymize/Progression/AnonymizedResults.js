import React, { Fragment, useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { Row, Col, Button } from "react-bootstrap"

import apis from "../../../services/apis"

import { addStudiesToDeleteList } from "../../../actions/DeleteList"
import { addStudiesToExportList } from "../../../actions/ExportList"
import TableStudies from "../../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies"
import { errorMessage } from "../../../tools/toastify"
import { exportCsv } from "../../../tools/CSVExport"


export default ({ details }) => {

    const [studies, setStudies] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        handleTask()
    }, [details])

    const handleTask = async () => {
        let studiesData = studies
        if (details.items == undefined) { }
        else {
            for (const item of details.items) {
                if (item.state === "completed") {
                    if (!containsStudy(item.result)) {
                        try {
                            let study = await apis.content.getStudiesDetails(item.result)
                            console.log(item.result)
                            console.log(study)
                            studiesData.push({
                                StudyOrthancID: study.ID,
                                StudyInstanceUID: study.MainDicomTags.StudyInstanceUID,
                                AnonymizedFrom: study.AnonymizedFrom,
                                PatientID: study.PatientMainDicomTags.PatientID,
                                PatientName: study.PatientMainDicomTags.PatientName,
                                StudyDate: study.MainDicomTags.StudyDate,
                                StudyDescription: study.MainDicomTags.StudyDescription,
                                newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '',
                                newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : '',
                                Series: study.Series
                            })
                        } catch (err) {
                        }
                    }
                }
            }
        }
        setStudies(studiesData)
    }

    const containsStudy = (studyID) => {
        let r = false
        for (var i = 0; i < studies.length; i++) {
            if (studies[i].StudyOrthancID == studyID) {
                r = true
                break
            }
        }
        return r
    }

    const getCSV = () => {
        let csvData = []
        if (studies.length === 0) {
            errorMessage('Empty List')
            return
        }
        studies.map(async (study) => {
            try {
                let originalStudy = await apis.content.getStudiesDetails(study.AnonymizedFrom)
                console.log(originalStudy)

                csvData.push({
                    AnonymizedFrom: study.AnonymizedFrom,
                    OriginalPatientID: originalStudy.PatientMainDicomTags.PatientID,
                    NewPatientID: study.PatientID,
                    OriginalPatientName: originalStudy.PatientMainDicomTags.PatientName,
                    NewPatientName: study.PatientName,
                    StudyID: study.StudyID,
                    StudyDate: originalStudy.MainDicomTags.StudyDate,
                    OriginalStudyDescription: originalStudy.MainDicomTags.StudyDescription,
                    NewStudyDescription: study.newStudyDescription,
                    StudyInstanceUID: originalStudy.MainDicomTags.StudyInstanceUID,
                    StudyOrthancID: study.StudyOrthancID,
                    StudyTime: study.StudyTime,
                    OriginalAccessionNumber: originalStudy.MainDicomTags.AccessionNumber,
                    NewAccessionNumber: study.newAccessionNumber,
                    Series: study.Series
                })
            } catch (err) {
                errorMessage(err.statusText)
            }
        })
        exportCsv(csvData, '.csv', 'AnonDicomDetails.csv')
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
                    <TableStudies studies={studies} />
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
                    <Button className="otjs-button otjs-button-blue w-12" onClick={getCSV}>
                        Download list as CSV
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )

}