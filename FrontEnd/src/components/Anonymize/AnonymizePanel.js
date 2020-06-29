import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import cellEditFactory from 'react-bootstrap-table2-editor'
import Select from 'react-select'

import TablePatient from '../CommonComponents/RessourcesDisplay/TablePatients'
import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"
import apis from "../../services/apis"

import { addToAnonymizedList, emptyAnonymizeList, removePatientFromAnonList, removeStudyFromAnonList, saveNewValues, saveProfile, autoFill } from '../../actions/AnonList'
import { studyArrayToPatientArray } from '../../tools/processResponse'
import { toastifyError } from "../../services/toastify"


class AnonymizePanel extends Component {

    state = { 
        currentPatient: '', 
        prefix: '', 
        progress: {}
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
        this.testAllId = this.testAllId.bind(this)
    }

    updateProgress(progress, i){
        i++
        this.setState({
            progress: {
                ...this.state.progress,
                [i] : {
                    nb: i, 
                    progress: progress, 
                    status: progress < 100 ? 'item btn btn-danger' : 'item btn btn-success'
                }
            }
        })
        this.displayRows()
    }

    displayRows(){
        let rows = []
        for(let i in this.state.progress){
            rows.push(<button disabled={true} type='button' key={this.state.progress[i].nb} className={this.state.progress[i].status} >job n°{this.state.progress[i].nb} : {this.state.progress[i].progress}%{'\n'}</button>)
        }
        this.setState({
            rows: rows
        })
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
        this.props.emptyAnonymizeList()
    }

    rowEvents = {
        onClick: (e, row) => {
            this.setState({currentPatient: row.PatientOrthancID})
        }
    }

    rowStyle = (row) => {
        const style = {};
        if (row.PatientOrthancID === this.state.currentPatient){
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    saveNewValues(ID, column, newValue, row){
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
            this.props.setProgress(answer)
        } else toastifyError('Fill all patient ID')
    }

    async addNewStudy(jobID){
        let content = await this.getContentJob(jobID)
        let studyID = content.ID
        let studyDetail = await apis.content.getStudiesDetails(studyID)
        this.props.addToAnonymizedList([studyDetail])
        this.removeStudy(studyDetail.AnonymizedFrom)
    }

    async getContentJob(jobID){
        let infos = await apis.jobs.getJobInfos(jobID)
        return infos.Content
    }

    
    componentWillUnmount() {
        if (this.job){
            this.job.forEach(job => {
                if (job !== undefined) job.cancelJob()
            })
        }
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
                                    this.saveNewValues(row.PatientOrthancID, column.dataField, newValue, row)
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
                                blurToSave: true,
                                autoSelectText: true,
                                mode: 'click',
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.saveNewValues(row.StudyOrthancID, column.dataField, newValue, row)
                                }
                            }) }
                            pagination={true}
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
                <pre>
                    {this.state.rows}
                </pre>
            </Fragment>
        )
            
    }
}

const mapStateToProps = state => {
    return { 
        anonList: state.AnonList.anonList, 
        profile: state.AnonList.profile, 
        username: state.Username.username
    }
}
const mapDispatchToProps = {
    addToAnonymizedList,
    emptyAnonymizeList,
    removePatientFromAnonList, 
    removeStudyFromAnonList,
    saveNewValues, 
    saveProfile, 
    autoFill
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonymizePanel)