import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { Prompt } from 'react-router-dom'

import { Modal, Row, Col, ProgressBar } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

import TableImportError from './TableImportError'
import AnonExportDeleteSendButton from './AnonExportDeleteSendButton'
import TablePatientWithNestedStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies'

import { treeToPatientArray, treeToStudyArray } from '../../tools/processResponse'
import { addStudiesToExportList } from '../../actions/ExportList'
import { addStudiesToDeleteList } from '../../actions/DeleteList'
import { addStudiesToAnonList } from '../../actions/AnonList'
import apis from '../../services/apis'

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
                    console.log(response)
                    await addUploadedFileToState(response)
                } catch (error) {
                    console.log(error)
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
            studies[studyDetails.ID] = studyDetails
            return studies
        })

        setPatientsObjects((patient) => {
            patient[studyDetails.ParentPatient] = studyDetails.PatientMainDicomTags
            return patient
        })
    }

    const addSeriesToState = (seriesDetails) => {
        setSeriesObjects(series => {
            series[seriesDetails.ID] = {
                ...seriesDetails,
                Instances: 1
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
                series[orthancAnswer.ParentSeries]['Instances']++
                return series
            })

        }

        let isExistingStudy = isKnownStudy(orthancAnswer.ParentStudy)

        if (!isExistingStudy) {
            let studyDetails = await apis.content.getStudiesDetails(orthancAnswer.ParentStudy)
            addStudyToState(studyDetails)
        }

        let seriesDetails = await apis.content.getSeriesDetailsByID(orthancAnswer.ParentSeries)
        addSeriesToState(seriesDetails)

    }

    const buildImportTree = () => {
        let importedTree = {}

        function addNewPatient(patientID, patientDetails) {
            if (!Object.keys(importedTree).includes(patientID)) {
                importedTree[patientID] = {
                    PatientOrthancID: patientID,
                    ...patientDetails,
                    studies: {}
                }
            }
        }

        function addNewStudy(studyID, studyDetails) {
            if (!Object.keys(importedTree[studyDetails.ParentPatient]['studies']).includes(studyID)) {
                importedTree[studyDetails.ParentPatient]['studies'][studyID] = {
                    ...studyDetails["MainDicomTags"],
                    series: {}
                }
            }

        }

        for (let seriesID of Object.keys(seriesObjects)) {
            let series = seriesObjects[seriesID]
            let studyDetails = studiesObjects[series.ParentStudy]
            let patientDetails = patientsObjects[studyDetails.ParentPatient]
            addNewPatient(studyDetails.ParentPatient, patientDetails)
            addNewStudy(series.ParentStudy, studyDetails)
            importedTree[studyDetails.ParentPatient]['studies'][series.ParentStudy]['series'][series.ID] = {
                ...series["MainDicomTags"],
                Instances: series['Instances']
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
                    <TablePatientWithNestedStudies patients={buildImportTree()} />
                </Col>
            </Row>
            <AnonExportDeleteSendButton onAnonClick={sendImportedToAnon}
                onExportClick={sendImportedToExport}
                onDeleteClick={sendImportedToDelete}
            />
        </div>
    )
}