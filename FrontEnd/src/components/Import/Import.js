import React, { Component } from 'react'
import { connect } from "react-redux"

import { StatusBar,DragDrop } from '@uppy/react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

import Modal from 'react-bootstrap/Modal'

import TablePatientsWithNestedStudiesAndSeries from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudiesAndSeries'
import TableImportError from './TableImportError'
import apis from '../../services/apis'
import {treeToPatientArray, treeToStudyArray} from '../../tools/processResponse'

import {addStudiesToExportList} from '../../actions/ExportList'
import {addStudiesToDeleteList} from '../../actions/DeleteList'
import {addStudiesToAnonList} from '../../actions/AnonList'
import { Prompt } from 'react-router-dom'

class Import extends Component {

    state = {
        errors : [],
        patientsObjects : {},
        studiesObjects : {},
        seriesObjects : {},
        showErrors : false, 
        inProgress: false
    }

    currentTree = {}

    constructor(props){

        super(props)
        this.handleShowErrorClick = this.handleShowErrorClick.bind(this)
        this.sendImportedToAnon = this.sendImportedToAnon.bind(this)
        this.sendImportedToExport = this.sendImportedToExport.bind(this)
        this.sendImportedToDelete = this.sendImportedToDelete.bind(this)
        
        this.uppy = Uppy({
            autoProceed: true,
            allowMultipleUploads: true,
        })

        this.uppy.use(XHRUpload, {
            endpoint: '/api/instances',
            formData : false,
            limit : 1,
            headers: {
                'Content-Type' : 'application/dicom',
                'Accept': 'application/json'
            }
        })

        this.uppy.on('upload-success', async (file, response) => {
            if(response.body.ID !== undefined){
                await this.addUploadedFileToState(response.body)
            }
        })

        this.uppy.on('upload-error', (file, error, response) => {
            this.uppy.removeFile(file.id)
            let info = JSON.parse(response.body.error)
            this.addErrorToState(file.id, file.name, info.Details)
        })
        this.uppy.on('upload', () => this.setState({inProgress: true}))
        this.uppy.on('complete', () => this.setState({inProgress: false}))
        this.uppy.on('cancel-all', () => this.setState({inProgress: false}))

    }

    componentWillUnmount () {
        this.uppy.close()
    }

    /**
     * add a failed import in error list
     * @param {string} fileID 
     * @param {string} file 
     * @param {string} error 
     */
    addErrorToState(fileID, filename, error){
        let errors = this.state.errors
        errors.push({
            fileID : fileID,
            filename : filename,
            error : error
        })

        this.setState({
            errors : errors
        })

    }
    
    async addUploadedFileToState(orthancAnswer){
        let isExistingSerie = this.isKnownSeries(orthancAnswer.ParentSeries)
        console.log(isExistingSerie)
        if ( isExistingSerie )  {
            this.setState(state => {
                console.log(state.seriesObjects[orthancAnswer.ParentSeries]['Instances']) 
                state.seriesObjects[orthancAnswer.ParentSeries]['Instances'] ++
                return state
            } )
            return
        }

        let isExistingStudy = this.isKnownStudy(orthancAnswer.ParentStudy)

        if(!isExistingStudy){
            let studyDetails = await apis.content.getStudiesDetails(orthancAnswer.ParentStudy)
            this.addStudyToState(studyDetails)
        }
        
        let seriesDetails = await apis.content.getSeriesDetailsByID(orthancAnswer.ParentSeries)
        this.addSeriesToState(seriesDetails)

    }

    addStudyToState(studyDetails){
        this.setState( state => {
            state.studiesObjects[studyDetails.ID] = studyDetails
            state.patientsObjects[studyDetails.ParentPatient] = studyDetails.PatientMainDicomTags
            return state
        })
    }

    addSeriesToState(seriesDetails){
        this.setState( state => {
            state.seriesObjects[seriesDetails.ID] = {
                ...seriesDetails,
                Instances : 1
            }
            return state
        })
    }

    buildImportTree(){
        let importedSeries = this.state.seriesObjects
        let importedTree = {}

        function addNewPatient(patientID, patientDetails){
            if( ! Object.keys(importedTree).includes(patientID) ) {
                importedTree[patientID] = {
                    PatientOrthancID : patientID,
                    ...patientDetails,
                    studies : {}
                }
            }
        }

        function addNewStudy(studyID, studyDetails){
            if( ! Object.keys(importedTree[studyDetails.ParentPatient]['studies']).includes(studyID) ) {
                importedTree[studyDetails.ParentPatient]['studies'][studyID] = {
                    ...studyDetails["MainDicomTags"],
                    series : {}
                }
            }

        }

        for(let seriesID of Object.keys(importedSeries)){
            let series = this.state.seriesObjects[seriesID]
            let studyDetails = this.state.studiesObjects[series.ParentStudy]
            let patientDetails = this.state.patientsObjects[studyDetails.ParentPatient]
            addNewPatient(studyDetails.ParentPatient, patientDetails)
            addNewStudy(series.ParentStudy, studyDetails)
            importedTree[studyDetails.ParentPatient]['studies'][series.ParentStudy]['series'][series.ID]={
                ...series["MainDicomTags"],
                Instances : series['Instances']
            }
        }

        this.currentTree = importedTree

        let resultArray = treeToPatientArray(importedTree)

        return resultArray

    }

    /**
     * check if study is already known
     * @param {string} studyID 
     */
    isKnownStudy( studyID ) {
        return Object.keys(this.state.studiesObjects).includes(studyID)
    }
    
    isKnownSeries ( seriesID ) {
        return Object.keys(this.state.seriesObjects).includes(seriesID)
    }

    sendImportedToExport() {
        this.props.addStudiesToExportList(treeToStudyArray(this.state.studiesObjects))
    }

    sendImportedToAnon(){
        this.props.addStudiesToAnonList(treeToStudyArray(this.state.studiesObjects))
    }

    sendImportedToDelete(){
        this.props.addStudiesToDeleteList(treeToStudyArray(this.state.studiesObjects))
    }

    /**
     * Trigger the display of the error table
     */
    handleShowErrorClick(){
        this.setState({
            showErrors : !this.state.showErrors
        })
    }

    render(){
        return (
            <div className="jumbotron">
                <h2 className="col card-title">Import Dicom Files</h2>
                <div className="col mb-5">
                    <DragDrop
                        uppy={this.uppy}
                        locale={{
                            strings: {
                                dropHereOr: 'Drop Dicom Folder',
                                browse: 'browse'
                            }
                        }}
                    />
                    <StatusBar hideUploadButton={false} showProgressDetails={true} hideRetryButton={true} hideAfterFinish={false} uppy={this.uppy} />
                    
                    <div className="float-right">
                        <input type="button" className="btn btn-warning" value={"See Errors ("+this.state.errors.length+")"} onClick={this.handleShowErrorClick} />
                    </div>

                    <Modal show={this.state.showErrors} onHide={this.handleShowErrorClick}>
                        <Modal.Header closeButton>
                            <Modal.Title>Errors</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> 
                            <TableImportError data={this.state.errors} />
                        </Modal.Body>
                    </Modal>
                
                </div>
                <div className="col">
                    <TablePatientsWithNestedStudiesAndSeries 
                        patients = {this.buildImportTree()}
                    />
                </div>
                <div className="row text-center mt-3">
                    <div className="col">
                        <input type="button" className="btn btn-info" value="To Anonymize" onClick={this.sendImportedToAnon} />
                    </div>
                    <div className="col">
                        <input type="button" className="btn btn-primary" value="To Export" onClick ={this.sendImportedToExport}/>
                    </div>
                    <div className="col">
                        <input type="button" className="btn btn-warning" value="To Delete" onClick ={this.sendImportedToDelete} />
                    </div>
                </div>
                <Prompt when={this.state.inProgress} message='Import in progress. Quit this page will stop the import'/>
            </div>

        )
    }
}

const mapDispatchToProps = {
    addStudiesToExportList,
    addStudiesToDeleteList,
    addStudiesToAnonList

}

export default connect(null, mapDispatchToProps)(Import)