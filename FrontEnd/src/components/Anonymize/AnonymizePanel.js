import React, {Component, useMemo} from "react"
import {connect} from "react-redux"
import {Col, Container, Row} from 'react-bootstrap'
import TablePatient from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/ReactTable/TableStudy"
import apis from "../../services/apis"
import AnonProfile from './AnonProfile'

import {
    autoFill,
    emptyAnonymizeList,
    removePatientFromAnonList,
    removeStudyFromAnonList,
    saveNewValues
} from '../../actions/AnonList'
import {studyArrayToPatientArray} from '../../tools/processResponse'

import {toast} from "react-toastify"

/**
 * This componnent wrapper allows to optimise the table by memoizing data
 * because getStudies return a different object everytime the component state updates
 * @param studies list of the studies
 * @param selectedPatient patient currently selected to show their studies
 * @param props props required by the table
 * @returns {JSX.Element} The table
 */
function StudyTableWrapper({studies, selectedPatient, ...props}) {
    const data = useMemo(() => studies
        .filter(study => study.ParentPatient === selectedPatient)
        .map(study => ({
            StudyOrthancID: study.ID,
            ...study.MainDicomTags,
            newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : study.MainDicomTags.StudyDescription,
            newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : 'OrthancToolsJS'
        })), [studies, selectedPatient])
    return <TableStudy studies={data} {...props}/>
}

function PatientTableWrapper({studies, ...props}) {
    const patients = useMemo(() => studyArrayToPatientArray(studies).map(patient => ({
        ...patient,
        newPatientName: patient.newPatientName ? patient.newPatientName : '',
        newPatientID: patient.newPatientID ? patient.newPatientID : ''
    })), [studies]);
    return <TablePatient patients={patients} {...props}/>
}


class AnonymizePanel extends Component {

    state = {
        currentPatient: '',
        prefix: ''
    }

    testAllId = () => {
        let answer = true
        this.props.anonList.forEach((item) => {
            if (item.PatientMainDicomTags.newPatientID === undefined)
                answer = false
        })
        return answer
    }

    anonymize = async () => {
        if (this.testAllId()) { //check all id 
            let listToAnonymize = []
            this.props.anonList.forEach(element => {
                let anonItem = {
                    orthancStudyID: element.ID,
                    profile: this.props.profile,
                    newPatientName: element.PatientMainDicomTags.newPatientName,
                    newPatientID: element.PatientMainDicomTags.newPatientID,
                    newStudyDescription: element.MainDicomTags.newStudyDescription ? element.MainDicomTags.newStudyDescription : element.MainDicomTags.StudyDescription,
                    newAccessionNumber: element.MainDicomTags.newAccessionNumber ? element.MainDicomTags.newAccessionNumber : 'OrthancToolsJS'
                }

                listToAnonymize.push(anonItem)
            })

            try {
                let answer = await apis.anon.createAnonRobot(listToAnonymize, this.props.username) //wait for the robot's answer to know what do to next
                this.props.setTask(answer)
            } catch (error) {
                toast.error(error.statusText)
            }

        } else toast.error('Fill all patient ID')
    }

    rowStyle = (row) => {
        const style = {};
        if (row.PatientOrthancID === this.state.currentPatient) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    rowEvents = {
        onClick: (e, row) => {
            this.setState({currentPatient: row.PatientOrthancID})
        }
    }

    render = () => {
        return (
            <Container>
                <Row className="mt-5">
                    <Col xxl={6}>
                        <PatientTableWrapper
                            studies={this.props.anonList}
                            rowEvents={this.rowEvents}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={false}
                            textNameColumn={'Original Name'}
                            textIDColumn={'Original ID'}
                            showEditable={true}
                            onDataChange={(oldValue, newValue, row, column) => {
                                this.props.saveNewValues(row.PatientOrthancID, column, newValue)
                            }}
                            rowStyle={this.rowStyle}
                            onDelete={this.props.removePatientFromAnonList}
                            pagination={true}/>
                        <button type='button' className='otjs-button otjs-button-red mt-2 w-7'
                                onClick={this.props.emptyAnonymizeList}>
                            Empty List
                        </button>
                    </Col>
                    <Col xxl={6}>
                        <StudyTableWrapper
                            studies={this.props.anonList}
                            selectedPatient={this.state.currentPatient}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={false}
                            onDelete={this.props.removeStudyFromAnonList}
                            showEditable={true}
                            onDataChange={(oldValue, newValue, row, column) => {
                                this.props.saveNewValues(row.StudyOrthancID, column.dataField, newValue)
                            }}
                            hiddenName={true}
                            hiddenID={true}
                            hiddenAnonymized={true}
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
                                       onChange={(e) => this.setState({prefix: e.target.value})}/>
                            </Col>
                            <Col sm>
                                <button type='button' className='otjs-button otjs-button-orange'
                                        onClick={() => this.props.autoFill(this.state.prefix)}>
                                    AutoFill
                                </button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={6}>
                        <AnonProfile/>
                    </Col>
                </Row>
                <Row className="mt-4 border-top border-2 pt-4">
                    <Col className="text-center">
                        <button className='otjs-button otjs-button-blue w-7' type='button'
                                onClick={this.anonymize}>Anonymize
                        </button>
                    </Col>
                </Row>

            </Container>
        )

    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList,
        profile: state.AnonList.profile,
        username: state.OrthancTools.username
    }
}

const mapDispatchToProps = {
    emptyAnonymizeList,
    removePatientFromAnonList,
    removeStudyFromAnonList,
    saveNewValues,
    autoFill
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonymizePanel)