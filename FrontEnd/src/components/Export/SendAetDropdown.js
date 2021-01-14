import React, { Component } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from "../../services/apis"
import { toastifyError, toastifySuccess } from "../../services/toastify"
import MonitorJob from "../../tools/MonitorJob"

export default class SendAetDropdown extends Component {

    state = {
        disabled: false,
        title: "Send To Modality"
    }

    handleClickDownload = async (event) => {
        let destinationAet = event.currentTarget.id
        let jobAnswer = await apis.aets.storeAET(destinationAet, this.props.exportIds)

        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state) {
            if (state === MonitorJob.Success) {
                self.resetProgress()
                toastifySuccess('DicomTransfer Done')

            } else if (state === MonitorJob.Failure) {
                self.resetProgress()
                toastifyError('DicomTransfer Failed')

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
        if (this.job !== undefined) this.job.cancel()
    }

    render = () => {

        let dropDownItems = []
        this.props.aets.forEach(aet => {
            dropDownItems.push(<Dropdown.Item key={aet} id={aet} onClick={this.handleClickDownload} >{aet}</Dropdown.Item>)
        })

        return (
            <DropdownButton variant="success" disabled={this.state.disabled} title={this.state.title}>
                {dropDownItems}
            </DropdownButton>
        )
    }

}