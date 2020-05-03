import React, { Component } from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { StatusBar,DragDrop } from '@uppy/react'
import Modal from 'react-bootstrap/Modal'

import TablePatientsWithNestedStudiesAndSeries from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudiesAndSeries'
import apis from '../../services/apis'
import {treeToPatientArray} from '../../tools/processResponse'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
export default class Import extends Component {

    state = {
        importedTree : {},
        errors : [],
        seriesIdArray : [],
        studiesIdArray : [],
        patientIdArray : [],
        showErrors : false
    }

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
            console.log(response)
            if(response.body.ID !== undefined){
                await this.addUploadedFileToState(response.body)
            }
            
        })

        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file)
            console.log('error message:', response)
            this.uppy.removeFile(file.id)
            let info = JSON.parse(response.body.error)
            this.addErrorToState(file.name, info.Details)
            

          })

    }

    componentWillUnmount () {
        this.uppy.close()
    }

    addErrorToState(file, error){
        let errors = this.state.errors
        errors.push({
            file : file,
            error : error
        })
        this.setState({
            errors : errors
        })

        console.log(this.state.errors)
    }
    
    async addUploadedFileToState(orthancAnswer){
        let isExistingSerie = this.isKnownSeries(orthancAnswer.ParentSeries)
        if (isExistingSerie) return

        let isExistingPatient = this.isknownPatient(orthancAnswer.ParentPatient)
        let isExistingStudy = this.isKnownStudy(orthancAnswer.ParentStudy)

        if(!isExistingStudy || !isExistingPatient){

            let studyDetails = await apis.content.getSeriesParentDetails(orthancAnswer.ParentSeries, 'study')

            if(!isExistingPatient){
                this.addPatientToState(orthancAnswer.ParentPatient, studyDetails.PatientMainDicomTags)
            }

            if(!isExistingStudy){
                this.addStudyToState(orthancAnswer.ParentPatient, orthancAnswer.ParentStudy, studyDetails.MainDicomTags)
            }

        }
        
        if(!isExistingSerie) {
            let seriesDetails = await apis.content.getSeriesParentDetails(orthancAnswer.ParentSeries, '')
            this.addSeriesToState(orthancAnswer.ParentPatient, orthancAnswer.ParentStudy, orthancAnswer.ParentSeries,  seriesDetails.MainDicomTags)
        }

        console.log(this.state)

    }

    addPatientToState(patientID, mainDicomTags){
        let objectToAdd = []
        objectToAdd[patientID] = mainDicomTags
        objectToAdd[patientID]['studies']=[]
        this.setState(state => {
                Object.assign(state['importedTree'], objectToAdd)
                state.patientIdArray.push(patientID)
                return state
            }
        )
    }

    addStudyToState(patientID, studyID, mainDicomTags){
        let objectToAdd = []
        objectToAdd[studyID] = mainDicomTags
        objectToAdd[studyID]['series'] = []
        this.setState(state => {
            Object.assign(state['importedTree'][patientID].studies, objectToAdd)
            state.studiesIdArray.push(studyID)
            return state
            }
        )
    }

    addSeriesToState(patientID, studyID, seriesID, mainDicomTags){
        let objectToAdd = []
        objectToAdd[seriesID] = mainDicomTags
        this.setState(state => {
            Object.assign(state['importedTree'][patientID]['studies'][studyID]['series'], objectToAdd);
            state.seriesIdArray.push(seriesID)
            return state
            }
        )

    }

    isknownPatient(patientID){
        let answer  = this.state.patientIdArray.includes(patientID)
        if (! answer ) {
            this.setState(state => {
                state.patientIdArray.push(patientID)
                return state
                }
            )
        }
        return answer
    }

    isKnownStudy(studyID){
        let answer = this.state.studiesIdArray.includes(studyID)
        if( ! answer ){
            this.setState(state => {
                state.studiesIdArray.push(studyID)
                return state
                }
            )
        }
        return answer
    }

    isKnownSeries(serieID){
        let answer = this.state.seriesIdArray.includes(serieID)
        if (!answer) {
            this.setState(state => {
                state.seriesIdArray.push(serieID)
                return state
                }
            )
        }
        return answer
    }

    onDeletePatient(deletedStudyID){
        let importedTree = this.state.importedTree
        delete importedTree[deletedStudyID]
        this.setState({
            importedTree : importedTree
        })
    }

    removeStudyForPatient(patientID, studyID){
        let importedTree = this.state.importedTree
        delete importedTree[patientID]['studies'][studyID]

        if(importedTree[patientID]['studies'].lenght == 0 ) {
            this.onDeletePatient(patientID)
            return
        }

        this.setState({
            importedTree : importedTree
        })
    }

    onDeleteStudy(deletedStudyID){

        for( let [patientID, details] in Object.entries(this.state.importedTree) ){
            if ( details['studies'].includes(deletedStudyID)) {
                this.removeStudyForPatient(patientID, deletedStudyID)
                break
            }
        }
    }

    //SK A FAIRE
    onDeleteSeries(){
        
    }

    handleShowErrorClick(){
        console.log('click')
        this.setState({
            showErrors : !this.state.showErrors
        })
        console.log(this.state)
    }

    render(){
        return (
            <div className="jumbotron">
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
                        <input type="button" className="btn btn-warning" value="See Errors" onClick={this.handleShowErrorClick} />
                    </div>

                    <Modal show={this.state.showErrors} onHide={this.handleShowErrorClick}>
                        <Modal.Header closeButton>
                            <Modal.Title>Errors</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> Errors Here</Modal.Body>
                    </Modal>
                
                </div>
                <div className="col">
                    <TablePatientsWithNestedStudiesAndSeries 
                        patients = {treeToPatientArray(this.state.importedTree)}
                        onDeletePatient = {this.onDeletePatient}
                        onDeleteStudy = {this.onDeleteStudy}
                        onDeleteSeries = {this.onDeleteSeries} />
                </div>
            </div>

        )
    }
}