import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Col, Container, Row } from 'react-bootstrap'
import TablePatients from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatients'
import apis from "../../services/apis"
import AnonProfile from './AnonProfile'

import {
    autoFill,
    emptyAnonymizeList,
    removePatientFromAnonList,
    removeStudyFromAnonList,
    saveNewValues
} from '../../actions/AnonList'
import { studyArrayToPatientArray } from '../../tools/processResponse'

import { toast } from "react-toastify"
import TableStudyAnon from "../CommonComponents/RessourcesDisplay/ReactTable/TableStudyAnon"

/**
 * This componnent wrapper allows to optimise the table by memoizing data
 * because getStudies return a different object everytime the component state updates
 * @param studies list of the studies
 * @param selectedPatient patient currently selected to show their studies
 * @param props props required by the table
 * @returns {JSX.Element} The table
 */

export default (setTask) => {

    const [currentPatient, setCurrentPatient] = useState('')
    const [prefix, setPrefix] = useState('')

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            anonList: state.AnonList.anonList,
            profile: state.AnonList.profile,
            username: state.OrthancTools.username
        }
    })

    const patients = useMemo(() => studyArrayToPatientArray(store.anonList).map(patient => ({
        ...patient,
        newPatientName: patient.newPatientName ? patient.newPatientName : '',
        newPatientID: patient.newPatientID ? patient.newPatientID : ''
    })), [store.anonList])

    const studiesData = useMemo(() => store.anonList
        .filter(study => study.PatientOrthancID === currentPatient)
        .map(study => ({
            ...study,
            newStudyDescription: study.newStudyDescription ? study.newStudyDescription : study.StudyDescription,
            newAccessionNumber: study.newAccessionNumber ? study.newAccessionNumber : 'OrthancToolsJS'
        }))
        , [store.anonList, currentPatient])

    const testAllId = () => {
        let answer = true
        store.anonList.forEach((item) => {
            if (item.PatientMainDicomTags.newPatientID === undefined)
                answer = false
        })
        return answer
    }

    const anonymize = async () => {
        if (testAllId()) { //check all id 
            let listToAnonymize = []
            store.anonList.forEach(element => {
                let anonItem = {
                    orthancStudyID: element.ID,
                    profile: store.profile,
                    newPatientName: element.PatientMainDicomTags.newPatientName,
                    newPatientID: element.PatientMainDicomTags.newPatientID,
                    newStudyDescription: element.MainDicomTags.newStudyDescription ? element.MainDicomTags.newStudyDescription : element.MainDicomTags.StudyDescription,
                    newAccessionNumber: element.MainDicomTags.newAccessionNumber ? element.MainDicomTags.newAccessionNumber : 'OrthancToolsJS'
                }

                listToAnonymize.push(anonItem)
            })

            try {
                let answer = await apis.anon.createAnonRobot(listToAnonymize, store.username) //wait for the robot's answer to know what do to next
                setTask(answer)
            } catch (error) {
                toast.error(error.statusText)
            }

        } else toast.error('Fill all patient ID')
    }

    const onRemovePatient = (PatientOrthancID) => {
        dispatch(removePatientFromAnonList(PatientOrthancID))
    }

    const onRemoveStudy = (StudyOrthancID) => {
        dispatch(removeStudyFromAnonList(StudyOrthancID))
    }

    const rowStyle = (PatientOrthancID) => {
        if (PatientOrthancID === currentPatient) return { background: 'peachPuff' }
    }


    const onClickPatientHandler = (PatientOrthancID) => {
        setCurrentPatient(PatientOrthancID)
    }


    const onDataChangePatient = (oldValue, newValue, row, column) => {
        dispatch(saveNewValues(row.PatientOrthancID, column, newValue))
    }

    const onDataChangeStudy = (oldValue, newValue, row, column) => {
        dispatch(saveNewValues(row.StudyOrthancID, column.dataField, newValue))
    }

    const onChange = (e) => setPrefix(e.target.value)

    const onClickAutoFill = () => dispatch(autoFill(prefix))

    const onClickEmpty = () => dispatch(emptyAnonymizeList)


    console.log('patients :', patients)
    console.log('studiesData :', studiesData)
    console.log('currentPatient:',currentPatient)
    return (
        <Container>
            <Row className="mt-5">
                <Col xxl={6}>
                    <TablePatients
                        patients={patients}
                        onRemovePatient={onRemovePatient}
                        actionBouton={false}
                        removeRow={true}
                        onRowClick={onClickPatientHandler}
                        textNameColumn={'Original Name'}
                        textIDColumn={'Original ID'}
                        showEditable={true}
                        onDataChange={onDataChangePatient}
                        rowStyle={rowStyle}
                        pagination={true} />
                    <button type='button' className='otjs-button otjs-button-red mt-2 w-7'
                        onClick={onClickEmpty}>
                        Empty List
                    </button>
                </Col>
                <Col xxl={6}>
                    <TableStudyAnon
                        studies={studiesData}
                        actionBouton={false}
                        removeRow={true}
                        onRemoveStudy={onRemoveStudy}
                        showEditable={true}
                        anonymized={false}
                        pagination={true}
                    />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col sm={6}>
                    <Row className="align-items-center">
                        <Col sm={8}>
                            <input type='text' name='prefix' id='prefix' className='form-control'
                                placeholder='prefix'
                                onChange={onChange} />
                        </Col>
                        <Col sm>
                            <button type='button' className='otjs-button otjs-button-orange'
                                onClick={onClickAutoFill}>
                                AutoFill
                            </button>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <AnonProfile />
                </Col>
            </Row>
            <Row className="mt-4 border-top border-2 pt-4">
                <Col className="text-center">
                    <button className='otjs-button otjs-button-blue w-7' type='button'
                        onClick={anonymize}>
                        Anonymize
                    </button>
                </Col>
            </Row>

        </Container>
    )

}

