import React, { Component } from "react"
import { connect } from "react-redux"
import cellEditFactory from 'react-bootstrap-table2-editor'
import Select from 'react-select'

import TablePatient from '../CommonComponents/RessourcesDisplay/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"

import { emptyAnonList, removePatientFromAnonList, removeStudyFromAnonList, saveNewValues } from '../../actions/AnonList'
import {studyArrayToPatientArray} from '../../tools/processResponse'


class AnonPanel extends Component {

    state = { 
        currentPatient: '', 
        profile: 'default'
    }


    constructor(props) {
        super(props)
        this.removePatient = this.removePatient.bind(this)
        this.removeStudy = this.removeStudy.bind(this)
        this.emptyList = this.emptyList.bind(this)
        this.saveNewValues = this.saveNewValues.bind(this)
        this.anonymize = this.anonymize.bind(this)
        this.changeProfile = this.changeProfile.bind(this)
    }

    changeProfile(event){
        this.setState({profile: event.value})
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
                    newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : ''
                })
            }
        })
        return studies
    }

    anonymize(){
        let listToAnonymize = []
        this.props.anonList.forEach(element => {
            let payload = {
                OrthancStudyID: element.ID, 
                profile: this.state.profile
            }
            if ((element.PatientMainDicomTags.newPatientName && element.PatientMainDicomTags.newPatientName !== '' )||
                (element.PatientMainDicomTags.newPatientID && element.PatientMainDicomTags.newPatientID !== '') ||
                (element.MainDicomTags.newStudyDescription && element.MainDicomTags.newStudyDescription !== '')){
                
                    payload = {
                        ...payload, 
                        Name: element.PatientMainDicomTags.newPatientName && element.PatientMainDicomTags.newPatientName !== '' ? element.PatientMainDicomTags.newPatientName : element.PatientMainDicomTags.PatientName, 
                        ID: element.PatientMainDicomTags.newPatientID && element.PatientMainDicomTags.newPatientID !== '' ? element.PatientMainDicomTags.newPatientID : element.PatientMainDicomTags.PatientID, 
                        StudyDescription: element.MainDicomTags.newStudyDescription && element.MainDicomTags.newStudyDescription !== '' ? element.MainDicomTags.newStudyDescription : element.MainDicomTags.StudyDescription
                    }
            }
            if (Object.keys(payload).length > 2)
                listToAnonymize.push(payload)
        })
        console.log('List à anonymiser : \n', listToAnonymize)
    }


    render() {
        const option = [
            {value: 'default', label: 'Default'}, 
            {value: 'full', label: 'Full'}
        ]
        return (
            <div className='jumbotron'>
                <h2 className='card-title mb-3'>Anonymize</h2>
                <div className="row">
                    <div className="col-sm">
                        <button type='button' className="btn btn-warning float-left" onClick={this.emptyList}>Empty List</button>
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
                <div className="row">
                    <div className="col-sm" >
                        <Select name='profile' single options={option} onChange={this.changeProfile} placeholder='Profile' defaultValue={option[0]} />  
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
        anonList: state.AnonList.anonList
    }
}
const mapDispatchToProps = {
    emptyAnonList, 
    removePatientFromAnonList, 
    removeStudyFromAnonList, 
    saveNewValues
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonPanel)