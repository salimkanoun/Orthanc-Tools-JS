import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Row } from 'react-bootstrap'
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
            if (item.newPatientID === undefined)
                answer = false
        })
        return answer
    }

    const anonymize = async () => {
        if (testAllId()) { //check all id 
            let listToAnonymize = []
            store.anonList.forEach(element => {
                let anonItem = {
                    orthancStudyID: element.StudyOrthancID,
                    profile: store.profile,
                    newPatientName: element.newPatientName,
                    newPatientID: element.newPatientID,
                    newStudyDescription: element.newStudyDescription ? element.newStudyDescription : element.StudyDescription,
                    newAccessionNumber: element.newAccessionNumber ? element.newAccessionNumber : 'OrthancToolsJS'
                }

                listToAnonymize.push(anonItem)
            })

            try {
                let answer = await apis.anon.createAnonRobot(listToAnonymize, store.username) //wait for the robot's answer to know what do to next
                setTask(answer)
            } catch (error) {
                toast.error(error.statusText, { data: { type: 'notification' } })
            }

        } else toast.error('Fill all patient ID', { data: { type: 'notification' } })
    }

    const onRemovePatient = (PatientOrthancID) => {
        dispatch(removePatientFromAnonList(PatientOrthancID))
    }

    const onRemoveStudy = (StudyOrthancID) => {
        console.log('onRemoveStudy studyOrthancID : ', StudyOrthancID)
        dispatch(removeStudyFromAnonList(StudyOrthancID))
    }

    const rowStyle = (PatientOrthancID) => {
        if (PatientOrthancID === currentPatient) return { background: 'peachPuff' }
    }


    const onClickPatientHandler = (PatientOrthancID) => {
        setCurrentPatient(PatientOrthancID)
    }


    const onEditPatient = (PatientOrthancID, column, newValue) => {
        dispatch(saveNewValues(PatientOrthancID, column, newValue))
    }

    const onEditStudy = (StudyOrthancID, column, newValue) => {
        dispatch(saveNewValues(StudyOrthancID, column, newValue))
    }

    const onChange = (e) => setPrefix(e.target.value)

    const onClickAutoFill = () => dispatch(autoFill(prefix))

    const onClickEmpty = () => dispatch(emptyAnonymizeList)

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
                        onEdit={onEditPatient}
                        rowStyle={rowStyle}
                        pagination={true} />
                    <Button className='otjs-button otjs-button-red mt-2 w-7'
                        onClick={onClickEmpty}>
                        Empty List
                    </Button>
                </Col>
                <Col xxl={6}>
                    <TableStudyAnon
                        studies={studiesData}
                        actionBouton={false}
                        removeRow={true}
                        onRemoveStudy={onRemoveStudy}
                        showEditable={true}
                        onEdit={onEditStudy}
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
                            <Button variant='warning' className='otjs-button'
                                onClick={onClickAutoFill}>
                                AutoFill
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <AnonProfile />
                </Col>
            </Row>
            <Row className="mt-4 border-top border-2 pt-4">
                <Col className="text-center">
                    <Button className='otjs-button otjs-button-blue w-7'
                        onClick={anonymize}>
                        Anonymize
                    </Button>
                </Col>
            </Row>

        </Container>
    )

}

