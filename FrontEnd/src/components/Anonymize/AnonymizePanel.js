import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import cellEditFactory from 'react-bootstrap-table2-editor'

import TablePatient from '../CommonComponents/RessourcesDisplay/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"
import apis from "../../services/apis"
import AnonProfile from './AnonProfile'

import { emptyAnonymizeList, removePatientFromAnonList, removeStudyFromAnonList, saveNewValues, autoFill } from '../../actions/AnonList'
import { studyArrayToPatientArray } from '../../tools/processResponse'
import { toastifyError } from "../../services/toastify"

class AnonymizePanel extends Component {

    state = { 
        currentPatient: '', 
        prefix: ''
    }

    constructor(props) {
        super(props)
        this.anonymize = this.anonymize.bind(this)
        this.testAllId = this.testAllId.bind(this)
    }

    getPatients(){
        let patients = []
        patients = studyArrayToPatientArray(this.props.anonList)
        for (let i in patients){
            patients[i] = {
                ...patients[i], 
                newPatientName: patients[i].newPatientName ? patients[i].newPatientName : '' , 
                newPatientID: patients[i].newPatientID ? patients[i].newPatientID : ''
            }
        }
        return patients
    }

    getStudy(){
        let studies = []
        this.props.anonList.forEach(study => {
            if (study.ParentPatient === this.state.currentPatient){
                studies.push({
                    StudyOrthancID: study.ID, 
                    ...study.MainDicomTags, 
                    newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : study.MainDicomTags.StudyDescription, 
                    newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : 'OrthancToolsJS'
                })
            }
        })
        return studies
    }

    testAllId(){
        let answer = true
        this.props.anonList.forEach((item) => {
            if (item.PatientMainDicomTags.newPatientID === undefined)
                answer = false
        })
        return answer
    }

    async anonymize(){
        if (this.testAllId()){ //check all id 
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

            let answer = await apis.anon.createAnonRobot(listToAnonymize, this.props.username) //wait for the robot's answer to know what do to next
            this.props.setTask(answer.id)
        } else toastifyError('Fill all patient ID')
    }

    rowStyle = (row) => {
        const style = {};
        if (row.PatientOrthancID === this.state.currentPatient){
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

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-sm mb-3">
                        <TablePatient 
                            data={this.getPatients()} 
                            rowEvents={this.rowEvents} 
                            hiddenActionBouton={true} 
                            hiddenRemoveRow={false} 
                            textNameColumn={'Original Name'} 
                            textIDColumn={'Original ID'}  
                            hiddenNewName={false} 
                            hiddenNewID={false} 
                            cellEdit={ cellEditFactory({ 
                                blurToSave: true,
                                autoSelectText: true,
                                mode: 'click', 
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.props.saveNewValues(row.PatientOrthancID, column.dataField, newValue)
                                }
                            }) }
                            rowStyle={this.rowStyle} 
                            onDelete={this.props.removePatientFromAnonList} />
                    </div>
                    <div className="col-sm">
                        <TableStudy 
                            data={this.getStudy()}
                            hiddenActionBouton={true} 
                            hiddenRemoveRow={false} 
                            onDelete={this.props.removeStudyFromAnonList}
                            editable={true}
                            cellEdit={ cellEditFactory({ 
                                blurToSave: true,
                                autoSelectText: true,
                                mode: 'click',
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.props.saveNewValues(row.StudyOrthancID, column.dataField, newValue)
                                }
                            }) }
                            pagination={true}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className='col-sm'>
                        <input type='text' name='prefix' id='prefix' className='form-control' placeholder='prefix' onChange={(e) => this.setState({prefix: e.target.value})} />
                    </div>
                    <div className='col-sm'>
                        <button type='button' className='btn btn-warning mr-3' onClick={() => this.props.autoFill(this.state.prefix)}>AutoFill</button>
                        <button type='button' className="btn btn-warning" onClick={this.props.emptyAnonymizeList}>Empty List</button>
                    
                    </div>
                    <div className='col-sm'>
                        </div>
                </div>
                <div className="row">
                    <div className='col-lg'>
                        <AnonProfile />
                    </div>
                    <div className="col-sm">
                        <button className='btn btn-primary' type='button' onClick={this.anonymize} >Anonymize</button> 
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