import React, { Component } from 'react'

import { StatusBar,DragDrop } from '@uppy/react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

import Modal from 'react-bootstrap/Modal'

import TablePatientsWithNestedStudiesAndSeries from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudiesAndSeries'
import TableImportError from './TableImportError'
import apis from '../../services/apis'
import {treeToPatientArray} from '../../tools/processResponse'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
export default class Import extends Component {

    state = {
        errors : [],
        patientsObjects : {},
        studiesObjects : {},
        seriesObjects : {},
        showErrors : false
    }

    currentTree = {}

    constructor(props){

        super(props)

        this.onDeletePatient = this.onDeletePatient.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
        this.onDeleteSeries = this.onDeleteSeries.bind(this)
        this.handleShowErrorClick = this.handleShowErrorClick.bind(this)
        
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

        console.log(this.state)

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
            if( ( patientID in Object.keys(importedTree) ) === false ){
                importedTree[patientID] = {
                    PatientOrthancID : patientID,
                    ...patientDetails,
                    studies : {}
                }
            }
        }

        function addNewStudy(studyID, studyDetails){
            if( (studyID in Object.keys(importedTree[studyDetails.ParentPatient]['studies']) ) === false ){
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

    /**
     * Remove a patient from test
     * @param {*} deletedStudyID 
     */
    onDeletePatient(deletedStudyID){
        //surement mieux de passer par l'API pour get les series de ce patient et l'enlever des imported series
        //Mais supprime tout le contenu d'orthanc et pas suelement les importé
        //Ou alors aller vers un dropdown spécial ?

    }

    /**
     * Remove a study from a patient, 
     * if last study, call the remove patient
     * @param {string} patientID 
     * @param {string} studyID 
     */
    removeStudyForPatient(patientID, studyID){

    }
    /**
     * Searches for the study deleted and triger the remove methode for study level
     * @param {string} deletedStudyID 
     */
    onDeleteStudy(deletedStudyID){

    }

    /**
     * Remove a series for list, if last series call the remove study method
     * @param {string} patientID 
     * @param {string} studyID 
     * @param {string} seriesID 
     */
    removeSeriesFromStudy(patientID, studyID, seriesID){

    }

    /**
     * Searches Series ID in imported tree to remove it
     * @param {String} deletedSeriesID 
     */
    onDeleteSeries(deletedSeriesID){
        
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
                        onDeletePatient = {this.onDeletePatient}
                        onDeleteStudy = {this.onDeleteStudy}
                        onDeleteSeries = {this.onDeleteSeries} />
                </div>
            </div>

        )
    }
}