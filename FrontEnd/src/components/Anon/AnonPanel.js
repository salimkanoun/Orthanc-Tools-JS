import React, { Component } from "react"
import { connect } from "react-redux"
import cellEditFactory from 'react-bootstrap-table2-editor'
import Select from 'react-select'

import TablePatient from '../CommonComponents/RessourcesDisplay/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"

import { emptyAnonList, removePatientFromAnonList, removeStudyFromAnonList } from '../../actions/AnonList'
import {studyArrayToPatientArray} from '../../tools/processResponse'


class AnonPanel extends Component {

    state = { 
        currentPatient: '', 
        profile: ''
    }


    constructor(props) {
        super(props)
        this.removePatient = this.removePatient.bind(this)
        this.removeStudy = this.removeStudy.bind(this)
        this.emptyList = this.emptyList.bind(this)
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

    getPatients(){
        let patients = []
        patients = studyArrayToPatientArray(this.props.anonList)
        for (let i in patients){
            patients[i] = {
                ...patients[i], 
                newPatientName: '', 
                newPatientID: ''
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
                    ...study.MainDicomTags
                })
            }
        })
        return studies
    }

    anonymize(){
        alert('Not implemented yet !')
    }


    render() {
        const option = [
            {value: 'full', label: 'Full'}, 
            {value: 'default', label: 'Default'}
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
                            cellEdit={ cellEditFactory({ mode: 'dbclick' }) } //Need to add listener 
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
                            cellEdit={ cellEditFactory({ mode: 'dbclick' }) } //Need to add listener 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" >
                        <Select name='profile' single options={option} onClick={this.changeProfile} placeholder='Profile' />  
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
    removeStudyFromAnonList
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonPanel)