import React, { Fragment, useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { Row, Col, Button } from "react-bootstrap"

import apis from "../../../services/apis"

import { addStudiesToDeleteList } from "../../../actions/DeleteList"
import { addStudiesToExportList } from "../../../actions/ExportList"
import TableStudies from "../../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies"
import { errorMessage } from "../../../tools/toastify"
import { exportCsv } from "../../../tools/CSVExport"
import Study from "../../../model/Study"


export default ({ items }) => {

    const [studies, setStudies] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        handleTask()
    }, [items])

    const handleTask = async () => {
        if (items == null) return
        let studiesData = [...studies]

        for (const item of items) {
            if (item.state === "completed") {
                if (!containsStudy(item.result)) {
                    try {
                        let studyOrthancID = item.result
                        let study = await apis.content.getStudiesDetails(studyOrthancID)
                        let studyInstance = new Study()
                        studyInstance.fillFromOrthanc(studyOrthancID, study.MainDicomTags, study.Series)
                        studyInstance.fillParentPatient(study.PatientPatient, study.PatientMainDicomTags)
                        studiesData.push({
                            ...studyInstance.serialize(),
                            AnonymizedFrom: study.AnonymizedFrom
                        })
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        }

        setStudies(studiesData)
    }

    const containsStudy = (studyID) => {
        return studies.filter(study => study.StudyOrthancID === studyID).length > 0
    }

    const generateCsvData = async () => {
        let csvData = []
        if (studies.length === 0) {
            errorMessage('Empty List')
            return
        }
        for (let study of studies) {
            try {
                let originalStudy = await apis.content.getStudiesDetails(study.AnonymizedFrom)

                csvData.push({
                    PatientName: study.ParentPatient.PatientName,
                    PatientID: study.ParentPatient.PatientID,
                    StudyDate: study.StudyDate,
                    StudyInstanceUID: study.StudyInstanceUID,
                    StudyOrthancID: study.StudyOrthancID,
                    AccessionNumber: study.AccessionNumber,
                    StudyDescription: study.StudyDescription,
                    OriginalPatientID: originalStudy.PatientMainDicomTags.PatientID,
                    OriginalPatientName: originalStudy.PatientMainDicomTags.PatientName,
                    OriginalAccessionNumber: originalStudy.MainDicomTags.AccessionNumber,
                    originalStudyDescription: originalStudy.MainDicomTags.StudyDescription,
                    OriginalStudyInstanceUID: originalStudy.MainDicomTags.StudyInstanceUID,
                })
            } catch (err) {
                errorMessage(err.statusText)
            }
        }
        return csvData

    }

    const exportList = () => {
        dispatch(addStudiesToExportList(studies))
    }

    const deleteList = () => {
        dispatch(addStudiesToDeleteList(studies))
    }

    const downloadCsv = async () => {
        let csvData = await generateCsvData()
        exportCsv(csvData, '.csv', 'AnonDicomDetails.csv')
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <TableStudies withPatientColums studies={studies} />
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-around">
                    <Button className='otjs-button otjs-button-blue w-10 me-4' disabled={studies.length === 0} onClick={exportList}>
                        To Export List
                    </Button>
                    <Button className='otjs-button otjs-button-red w-10 ms-4' disabled={studies.length === 0} onClick={deleteList}>
                        To Delete List
                    </Button>
                    <Button className="otjs-button otjs-button-blue w-12" onClick={downloadCsv}>
                        Download list as CSV
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )

}