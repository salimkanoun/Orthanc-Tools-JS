import React, { Component } from "react"
import {ButtonGroup, Dropdown } from "react-bootstrap"
import { toast } from "react-toastify"

import apis from "../../services/apis"
import MonitorJob from "../../tools/MonitorJob"

export default class SendAetDropdown extends Component {

    state = {
        disabled: false,
        title: "Send To Modality"
    }

    handleClickDownload = async (event) => {
        let destinationAet = event.currentTarget.id
        let jobAnswer
        
        try{
            jobAnswer = await apis.aets.storeAET(destinationAet, this.props.exportIds)
        }catch(error){
            toast.error(error.statusText)
            return;
        }

        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state) {
            if (state === MonitorJob.Success) {
                self.resetProgress()
                toast.success('DicomTransfer Done')

            } else if (state === MonitorJob.Failure) {
                self.resetProgress()
                toast.error('DicomTransfer Failed')

            }
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    updateProgress = (progress) => {
        this.setState({
            disabled: true,
            title: 'Sending ' + progress + ' %'
        })
    }

    resetProgress = () => {
        this.setState({
            disabled: false,
            title: "Send To Modality"
        })
    }

    componentWillUnmount = () => {
        if (this.job !== undefined) this.job.stopMonitoringJob()
    }

    render = () => {

        let dropDownItems = []
        this.props.aets.forEach(aet => {
            dropDownItems.push(<Dropdown.Item key={aet} id={aet} onClick={this.handleClickDownload} >{aet}</Dropdown.Item>)
        })

        return (
            <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="button-dropdown-orange" className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic" disabled={this.state.disabled}>
                    {this.state.title}
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    {dropDownItems}
                </Dropdown.Menu>
            </Dropdown>
           
        )
    }

}