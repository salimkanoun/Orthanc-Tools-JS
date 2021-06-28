import React, {Component, Fragment, useMemo} from "react"
import {connect} from "react-redux"

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


class AnonymizePanel extends Component {

    state = {
        currentPatient: '',
        prefix: ''
    }

    getPatients = () => {
        let patients = []
        patients = studyArrayToPatientArray(this.props.anonList)
        for (let i in patients) {
            patients[i] = {
                ...patients[i],
                newPatientName: patients[i].newPatientName ? patients[i].newPatientName : '',
                newPatientID: patients[i].newPatientID ? patients[i].newPatientID : ''
            }
        }
        return patients
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
            <Fragment>
                <h2 className='card-title mb-3'>Anonymize</h2>
                <div className="row">
                    <div className="col-sm mb-3">
                        <TablePatient
                            patients={this.getPatients()}
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
                            onDelete={this.props.removePatientFromAnonList}/>
                    </div>
                    <div className="col-sm">
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
                            pagination={true}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className='col-sm'>
                        <input type='text' name='prefix' id='prefix' className='form-control' placeholder='prefix'
                               onChange={(e) => this.setState({prefix: e.target.value})}/>
                    </div>
                    <div className='col-sm'>
                        <button type='button' className='btn btn-warning mr-3'
                                onClick={() => this.props.autoFill(this.state.prefix)}>AutoFill
                        </button>
                        <button type='button' className="btn btn-warning" onClick={this.props.emptyAnonymizeList}>Empty
                            List
                        </button>

                    </div>
                    <div className='col-sm'>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg'>
                        <AnonProfile/>
                    </div>
                    <div className="col-sm">
                        <button className='btn btn-primary' type='button' onClick={this.anonymize}>Anonymize</button>
                    </div>
                </div>
            </Fragment>
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