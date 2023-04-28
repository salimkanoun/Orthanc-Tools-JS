import React, { Fragment, useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { Row, Col, Button } from "react-bootstrap"

import apis from "../../../services/apis"

import { addStudiesToDeleteList } from "../../../actions/DeleteList"
import { addStudiesToExportList } from "../../../actions/ExportList"
import TableStudies from "../../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies"
import { studyColumns } from "../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories"
import { errorMessage } from "../../../tools/toastify"
import { exportCsv } from "../../../tools/CSVExport"


export default ({ details }) => {

    const [studies, setStudies] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        handleTask()
    }, [details])

    const handleTask = async () => {
        let studies = []
        if (details.items == undefined) { } else {
            for (const item of details.items) {
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
        }
        setStudies(studies)
    }

    const getCSV = () => {
        if (studies.length === 0) {
            errorMessage('Empty List')
            return
        }
        console.log(studies)

        let csvData = studies.map((study) => {
            return ({
                AnonymizedFrom : study.AnonymizedFrom,
                OriginalPatientID : study.OriginalPatientID,
                OriginalPatientName : study.OriginalPatientName,
                StudyID : study.StudyID,
                StudyDate : study.StudyDate,
                StudyDescription : study.StudyDescription,
                NewStudyDescription : study.newStudyDescription,
                StudyInstanceUID : study.StudyInstanceUID,
                StudyOrthancID : study.StudyOrthancID,
                StudyTime : study.StudyTime,
                AccessionNumber : study.AccessionNumber,
                NewAccessionNumber : study.newAccessionNumber,
                Series : study.Series
            })
        })

        exportCsv(csvData, '.csv', 'AnonDicomDetails.csv')
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

    const additionalColumns = [
        studyColumns.ANONYMIZED_FROM,
        {
            id: 'Remove',
            accessorKey: 'Remove',
            header: 'Remove',
            cell: ({ row }) => {
                return <Button className="btn btn-danger" onClick={() => {
                    removeStudyAnonymized(row.original.StudyOrthancID);
                }}>Remove</Button>
            }
        }
    ]

    return (
        <Fragment>
            <Row>
                <Col>
                    <TableStudies studies={studies} additionalColumns={additionalColumns} />
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