import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { Prompt } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { Modal, Row, Col, ProgressBar } from 'react-bootstrap'

import TableImportError from './TableImportError'
import TablePatientWithNestedStudiesAndSeries from '../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudiesAndSeries'

import { treeToPatientArray, treeToStudyArray } from '../../tools/processResponse'
import { addStudiesToExportList } from '../../actions/ExportList'
import { addStudiesToDeleteList } from '../../actions/DeleteList'
import { addStudiesToAnonList } from '../../actions/AnonList'
import apis from '../../services/apis'
import Study from '../../model/Study'
import Series from '../../model/Series'
import ExportDeleteSendButton from '../CommonComponents/RessourcesDisplay/ExportDeleteSendButton'


export default () => {

    const [errors, setErrors] = useState([])
    const [patientsObjects, setPatientsObjects] = useState({})
    const [studiesObjects, setStudiesObjects] = useState({})
    const [seriesObjects, setSeriesObjects] = useState({})
    const [showErrors, setShowErrors] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [numberOfFiles, setNumberOfFiles] = useState(0)
    const [processedFiles, setProcessedFiles] = useState(0)

    const [cancelImport, setCancelImport] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            setCancelImport(true)
        }
    }, [])

    const __pFileReader = (file) => {
        return new Promise((resolve, reject) => {
            var fr = new FileReader()
            fr.readAsArrayBuffer(file)
            fr.onload = () => {
                resolve(fr)
            }
        })
    }

    const addFile = async (files) => {

        setIsDragging(false)
        setInProgress(true)
        setNumberOfFiles(files.length)
        setProcessedFiles(0)

        let i = 1
        for (let file of files) {

            if (cancelImport) {
                console.log('Upload Interrupted')
                return
            }

            await __pFileReader(file).then(async (reader) => {
                const stringBuffer = new Uint8Array(reader.result)

                try {
                    let response = await apis.importDicom.importDicom(stringBuffer)
                    await addUploadedFileToState(response)
                } catch (error) {
                    addErrorToState(file.name, error.statusText)
                }

            })
            setProcessedFiles((processedFiles) => ++processedFiles)
            i = ++i
        }
        setInProgress(false)
    }

    const addErrorToState = (filename, error) => {
        setErrors((errors) => [
            ...errors,
            {
                fileID: Math.random(),
                filename: filename,
                error: error
            }
        ])

    }

    const addStudyToState = (studyDetails) => {
        setStudiesObjects((studies) => {
            studies[studyDetails.StudyOrthancID] = studyDetails
            return studies
        })

        setPatientsObjects((patient) => {
            patient[studyDetails.PatientOrthancID] = {
                PatientID: studyDetails.ParentPatient.PatientID,
                PatientName: studyDetails.ParentPatient.PatientName,
                PatientOrthancID: studyDetails.ParentPatient.PatientOrthancID,
                PatientSex: studyDetails.ParentPatient.PatientSex,
            }
            return patient
        })
    }

    const addSeriesToState = (seriesDetails) => {
        setSeriesObjects(series => {
            series[seriesDetails.SeriesOrthancID] = {
                ...seriesDetails,
                NumberOfInstances: 1
            }
            return series
        })
    }

    const isKnownSeries = (seriesID) => {
        return Object.keys(seriesObjects).includes(seriesID)
    }

    const isKnownStudy = (studyID) => {
        return Object.keys(studiesObjects).includes(studyID)
    }

    const addUploadedFileToState = async (orthancAnswer) => {
        let isExistingSerie = isKnownSeries(orthancAnswer.ParentSeries)

        if (isExistingSerie) {
            setSeriesObjects((series) => {
                series[orthancAnswer.ParentSeries]['NumberOfInstances']++
                return series
            })
            return
        }

        let isExistingStudy = isKnownStudy(orthancAnswer.ParentStudy)

        if (!isExistingStudy) {
            let studyDetails = await apis.content.getStudiesDetails(orthancAnswer.ParentStudy)
            let study = new Study()
            study.fillFromOrthanc(orthancAnswer.ParentStudy, studyDetails.MainDicomTags, [])
            study.fillParentPatient(studyDetails.ParentPatient, studyDetails.PatientMainDicomTags)
            addStudyToState(study.serialize())
        }

        let seriesDetails = await apis.content.getSeriesDetailsByID(orthancAnswer.ParentSeries)
        let series = new Series()
        series.fillFromOrthanc(orthancAnswer.ParentSeries, seriesDetails.MainDicomTags, [], orthancAnswer.ParentStudy)
        addSeriesToState(series.serialize())

    }

    const buildImportTree = () => {
        let importedTree = {}

        const addNewPatient = (patientID, patientDetails) => {
            if (!Object.keys(importedTree).includes(patientID)) {
                importedTree[patientID] = {
                    PatientOrthancID: patientID,
                    ...patientDetails,
                    Studies: {}
                }
            }
        }

        const addNewStudy = (StudyOrthancID, studyDetails) => {
            if (!Object.keys(importedTree[studyDetails.PatientOrthancID]['Studies']).includes(StudyOrthancID)) {
                importedTree[studyDetails.PatientOrthancID]['Studies'][StudyOrthancID] = {
                    ...studyDetails,
                    StudyOrthancID: StudyOrthancID,
                    Series: {}
                }
            }

        }

        for (let SeriesOrthancID of Object.keys(seriesObjects)) {
            let series = seriesObjects[SeriesOrthancID]
            let studyDetails = studiesObjects[series.StudyOrthancID]
            let patientDetails = patientsObjects[studyDetails.PatientOrthancID]
            addNewPatient(studyDetails.PatientOrthancID, patientDetails)
            addNewStudy(series.StudyOrthancID, studyDetails)
            importedTree[studyDetails.PatientOrthancID]['Studies'][series.StudyOrthancID]['Series'][series.SeriesOrthancID] = {
                ...series,
                StudyOrthancID: series.StudyOrthancID,
                NumberOfInstances: series['NumberOfInstances']
            }
        }

        let resultArray = treeToPatientArray(importedTree)

        return resultArray

    }

    const sendImportedToExport = () => {
        dispatch(addStudiesToExportList(treeToStudyArray(studiesObjects)))
    }

    const sendImportedToAnon = () => {
        dispatch(addStudiesToAnonList(treeToStudyArray(studiesObjects)))
    }

    const sendImportedToDelete = () => {
        dispatch(addStudiesToDeleteList(treeToStudyArray(studiesObjects)))
    }

    return (
        <div>
            <Prompt when={inProgress} message='Import in progress. Quit this page will stop the import' />
            <Modal show={showErrors} onHide={() => setShowErrors(false)} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Errors</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableImportError data={errors} />
                </Modal.Body>
            </Modal>
            <Row className="mt-5">
                <Col>
                    <Dropzone onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)}
                        disabled={inProgress} onDrop={acceptedFiles => addFile(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div
                                    className={(isDragging || inProgress) ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                                    <input directory="" webkitdirectory="" {...getInputProps()} />
                                    <p>{inProgress ? "Uploading" : "Drop Dicom Folder"}</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <ProgressBar
                        variant='info'
                        now={processedFiles}
                        min={0}
                        max={numberOfFiles}
                        label={processedFiles > 0 ? 'Uploading ' + processedFiles + '/' + numberOfFiles : null}
                    />
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                    <input type="button" className="otjs-button otjs-button-red w-10"
                        value={"See Errors (" + errors.length + ")"}
                        onClick={() => setShowErrors(true)} />
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                    <TablePatientWithNestedStudiesAndSeries patients={buildImportTree()} />
                </Col>
            </Row>
            <Row>
                <ExportDeleteSendButton onAnonClick={sendImportedToAnon}
                    onExportClick={sendImportedToExport}
                    onDeleteClick={sendImportedToDelete}
                />
            </Row>

        </div>
    )
}