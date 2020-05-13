import React, { Component } from "react"
import { connect } from "react-redux"
import cellEditFactory from 'react-bootstrap-table2-editor'
import Select from 'react-select'

import TablePatient from '../CommonComponents/RessourcesDisplay/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"

import { emptyAnonList, removePatientFromAnonList, removeStudyFromAnonList, saveNewValues, saveProfile, autoFill } from '../../actions/AnonList'
import {studyArrayToPatientArray} from '../../tools/processResponse'
import apis from "../../services/apis"


class AnonPanel extends Component {

    state = { 
        currentPatient: '', 
        prefix: ''
    }


    constructor(props) {
        super(props)
        this.removePatient = this.removePatient.bind(this)
        this.removeStudy = this.removeStudy.bind(this)
        this.emptyList = this.emptyList.bind(this)
        this.saveNewValues = this.saveNewValues.bind(this)
        this.anonymize = this.anonymize.bind(this)
        this.changeProfile = this.changeProfile.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.autoFill = this.autoFill.bind(this)
    }

    changeProfile(event){
        this.props.saveProfile(event.value)
    }

    removePatient(patientID){
        this.props.removePatientFromAnonList(patientID)
    }

    removeStudy(studyID){
        this.props.removeStudyFromAnonList(studyID)
    }

    emptyList(){
        this.props.emptyAnonList()
    }

    rowEvents = {
        onClick: (e, row, rowIndex) => {
            this.setState({currentPatient: row.PatientOrthancID})
        }
    }

    rowStyle = (row, rowIndex) => {
        const style = {};
        if (row.PatientOrthancID === this.state.currentPatient){
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    saveNewValues(ID, column, newValue){
        this.props.saveNewValues(ID, column, newValue)
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
                    newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '', 
                    newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
                })
            }
        })
        return studies
    }

    async anonymize(){
        let listToAnonymize = []
        this.props.anonList.forEach(element => {
            let payload = {
                OrthancStudyID: element.ID, 
                profile: this.props.profile
            }
            if ((element.PatientMainDicomTags.newPatientName && element.PatientMainDicomTags.newPatientName !== '' )||
                (element.PatientMainDicomTags.newPatientID && element.PatientMainDicomTags.newPatientID !== '') ||
                (element.MainDicomTags.newStudyDescription && element.MainDicomTags.newStudyDescription !== '') ||
                (element.MainDicomTags.newAccessionNumber && element.MainDicomTags.newAccessionNumber !== '')){
                
                    payload = {
                        ...payload, 
                        Name: element.PatientMainDicomTags.newPatientName && element.PatientMainDicomTags.newPatientName !== '' ? element.PatientMainDicomTags.newPatientName : element.PatientMainDicomTags.PatientName, 
                        ID: element.PatientMainDicomTags.newPatientID && element.PatientMainDicomTags.newPatientID !== '' ? element.PatientMainDicomTags.newPatientID : element.PatientMainDicomTags.PatientID, 
                        StudyDescription: element.MainDicomTags.newStudyDescription && element.MainDicomTags.newStudyDescription !== '' ? element.MainDicomTags.newStudyDescription : element.MainDicomTags.StudyDescription,
                        AccessionNumber: element.MainDicomTags.newAccessionNumber && element.MainDicomTags.newAccessionNumber !== '' ? element.MainDicomTags.newAccessionNumber : element.MainDicomTags.AccessionNumber
                    }
            }
            if (Object.keys(payload).length > 2)
                listToAnonymize.push(payload)
        })
        console.log('List à anonymiser : \n', listToAnonymize)
        let jobID = []
        for (let i in listToAnonymize){
            let study = listToAnonymize[i]
            console.log(study)
            let rep = await apis.anon.anonymize(study.OrthancStudyID, study.profile, study.AccessionNumber, study.Name, study.ID, study.StudyDescription)
            jobID.push(rep)
        }
        console.log('Jobs ID : ', jobID)
    }

    getProfileSelected(){
        let index = -1
        this.option.forEach(element => {
            if (element.value === this.props.profile){
                index = this.option.indexOf(element)
            }
        })
        return this.option[index]
    }

    handleChange(event){
        this.setState({prefix: event.target.value})
    }

    autoFill(){
        this.props.autoFill(this.state.prefix)
    }

    option = [
            {value: 'Default', label: 'Default'}, 
            {value: 'Full', label: 'Full'}
        ]

    render() {
        return (
            <div className='jumbotron'>
                <h2 className='card-title mb-3'>Anonymize</h2>
                
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
                                mode: 'dbclick', 
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.saveNewValues(row.PatientOrthancID, column.dataField, newValue)
                                }
                            }) }
                            rowStyle={this.rowStyle} 
                            onDelete={this.removePatient} />
                    </div>
                    <div className="col-sm">
                        <TableStudy 
                            data={this.getStudy()}
                            hiddenActionBouton={true} 
                            hiddenRemoveRow={false} 
                            onDelete={this.removeStudy}
                            editable={true}
                            cellEdit={ cellEditFactory({ 
                                mode: 'dbclick', 
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.saveNewValues(row.StudyOrthancID, column.dataField, newValue)
                                }
                            }) }
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className='col-sm'>
                        <input type='text' name='prefix' id='prefix' className='form-control' placeholder='prefix' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <button type='button' className='btn btn-warning mr-3' onClick={this.autoFill}>AutoFill</button>
                        <button type='button' className="btn btn-warning" onClick={this.emptyList}>Empty List</button>
                    
                    </div>
                    <div className='col-sm'>
                        </div>
                </div>
                <div className="row">
                    <div className="col-auto" >
                        <label htmlFor='profile'>Anon Profile : </label>
                    </div>
                    <div className="col-2" >
                        <Select name='profile' single options={this.option} onChange={this.changeProfile} placeholder='Profile' value={this.getProfileSelected()} />  
                    </div>
                    <div className="col-sm">
                        <button className='btn btn-primary' type='button' onClick={this.anonymize} >Anonymize</button> 
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        anonList: state.AnonList.anonList, 
        profile: state.AnonList.profile
    }
}
const mapDispatchToProps = {
    emptyAnonList, 
    removePatientFromAnonList, 
    removeStudyFromAnonList, 
    saveNewValues, 
    saveProfile, 
    autoFill
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonPanel)