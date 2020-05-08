import React, { Component } from "react"
import Dropdown from "react-bootstrap/Dropdown"

import apis from '../../services/apis'
import MonitorJob from '../../tools/MonitorJob'

export default class DownloadDropdown extends Component{

    state = {
        buttonText : "Download"
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
    }

    updateProgress (progress){
        this.setState({
            buttonText : "Preparing Zip "+ progress + "%"
        })
    }

    setStatusDownloading(){
        this.setState({
            buttonText : "Downloading"
        })
    }

    resetProgress(){
        this.setState({
            buttonText : "Download"
        })
    }

    async handleClickDownload(e){

        let jobAnswer

        if(e.currentTarget.id === 'hirarchical'){
            jobAnswer = await apis.exportDicom.exportHirachicalDicoms(this.props.exportIds)
        }else{
            jobAnswer = await apis.exportDicom.exportDicomDirDicoms(this.props.exportIds)
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
                this.resetProgress()
            }
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    componentWillUnmount(){
        if(this.job !== undefined) this.job.cancelJob()
    }

    render(){
        return (
            <Dropdown >
                <Dropdown.Toggle variant="success" id="dropdown-download" >
                    {this.state.buttonText}
                </Dropdown.Toggle>

                <Dropdown.Menu >
                    <button id='hirarchical' className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickDownload } >Hirarchical</button>
                    <button id='dicomdir' className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickDownload }>Dicomdir</button>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}