import React, { Component } from 'react'
import Uppy from '@uppy/core'
import StatusBar from '@uppy/status-bar'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'
import apis from '../../services/apis'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
export default class Import extends Component {

    state = {
        importedTree : {},
        seriesIdArray : [],
        studiesIdArray : [],
        patientIdArray : []
    }

    constructor(props){

        super(props)
        
        this.uppy = Uppy({
            autoProceed: true,
            allowMultipleUploads: true,
        })

        this.uppy.use(XHRUpload, {
            endpoint: '/api/instances',
            formData : false,
            headers: {
                'Content-Type' : 'application/dicom',
                'Accept': 'application/json'
            }
          })

        this.uppy.use(StatusBar, {
            id : 'statusBar',
            target: 'body',
            hideUploadButton: false,
            showProgressDetails: true,
            hideAfterFinish: false
          })

        this.uppy.on('upload-success', async (file, response) => {
            console.log(response)
            if(response.body.ID !== undefined){
                console.log('AvantTTT')
                await this.addUploadedFileToState(response.body)
                console.log('ApresTTT')
            }
            
        })

    }

    componentWillUnmount () {
        this.uppy.close()
    }
    
    async addUploadedFileToState(orthancAnswer){
        let isExistingSerie = this.isKnownSeries(orthancAnswer.ParentSeries)
        if (isExistingSerie) return

        let isExistingPatient = this.isknownPatient(orthancAnswer.ParentPatient)
        let isExistingStudy = this.isKnownStudy(orthancAnswer.ParentStudy)

        let newSeriesId = null
        let newStudyId = null
        let newPatientId = null

        if(!isExistingStudy || !isExistingPatient){

            let studyDetails = await apis.content.getSeriesParentDetails(orthancAnswer.ParentSeries, 'study')

            if(!isExistingPatient){
                this.addPatientToState(orthancAnswer.ParentPatient, studyDetails.PatientMainDicomTags)
                newPatientId = orthancAnswer.ParentPatient
            }

            if(!isExistingStudy){
                this.addStudyToState(orthancAnswer.ParentPatient, orthancAnswer.ParentStudy, studyDetails.MainDicomTags)
                newStudyId=orthancAnswer.ParentStudy
            }


        }
        
        if(!isExistingSerie) {
            let seriesDetails = await apis.content.getSeriesParentDetails(orthancAnswer.ParentSeries, '')
            this.addSeriesToState(orthancAnswer.ParentPatient, orthancAnswer.ParentStudy, orthancAnswer.ParentSeries,  seriesDetails.MainDicomTags)
            newSeriesId=orthancAnswer.ParentSeries

        }

        console.log(this.state)

        return true

    }

    addPatientToState(patientID, mainDicomTags){
        let objectToAdd = []
        objectToAdd[patientID] = mainDicomTags
        objectToAdd[patientID]['studies']=[]
        this.setState(state => {
                        Object.assign(state, objectToAdd)
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
            Object.assign(state[patientID].studies, objectToAdd)
            state.studiesIdArray.push(studyID)
            return state
            }
        )

    }

    addSeriesToState(patientID, studyID, seriesID, mainDicomTags){
        let objectToAdd = []
        objectToAdd[seriesID] = mainDicomTags
        this.setState(state => {
            Object.assign(state[patientID]['studies'][studyID]['series'], objectToAdd);
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

    render(){
        return (
            <div className="jumbotron">
                 <DragDrop
                    uppy={this.uppy}
                    locale={{
                        strings: {
                            dropHereOr: 'Drop Dicom Folder',
                            browse: 'browse'
                        }
                    }}
                />
            </div>

        )
    }
}