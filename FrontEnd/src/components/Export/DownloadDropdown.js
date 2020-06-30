import React, { Component } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from '../../services/apis'
import MonitorJob from '../../tools/MonitorJob'

export default class DownloadDropdown extends Component{

    state = {
        buttonText : "Download",
        disabled : false
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
        this.handleRootClick = this.handleRootClick.bind(this)
    }

    updateProgress (progress){
        this.setState({
            buttonText : "Preparing Zip "+ progress + "%",
            disabled : true
        })
    }

    setStatusDownloading(){
        this.setState({
            buttonText : "Downloading",
            disabled : true
        })
    }

    resetProgress(){
        this.setState({
            buttonText : "Download",
            disabled : false
        })
    }

    handleRootClick(e){
        e.stopPropagation()
    }

    async handleClickDownload(e){
        e.stopPropagation()

        let jobAnswer

        if(e.currentTarget.id === 'hirarchical'){
            jobAnswer = await apis.exportDicom.exportHirachicalDicoms(this.props.exportIds, this.props.TS)
        }else{
            jobAnswer = await apis.exportDicom.exportDicomDirDicoms(this.props.exportIds, this.props.TS)
        }

        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state){
            if(state === MonitorJob.Success){
                self.setStatusDownloading()
                await apis.exportDicom.downloadZip(jobAnswer.ID)
                self.resetProgress()
            }else if (state === MonitorJob.Failure){
                console.log('failure')
                self.resetProgress()
            }
            self.job = undefined
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    componentWillUnmount(){
        if(this.job !== undefined) this.job.cancelJob()
    }

    render(){

        return (
            <DropdownButton onClick={this.handleRootClick} variant="success" disabled={this.state.disabled} title = {this.state.buttonText}>
                <Dropdown.Item id='hirarchical' onClick={ this.handleClickDownload }>
                    Hirarchical
                </Dropdown.Item>
                <Dropdown.Item id='dicomdir' onClick={ this.handleClickDownload }>
                    Dicomdir
                </Dropdown.Item>
                
            </DropdownButton>
        )
    }


}