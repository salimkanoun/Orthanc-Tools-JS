import React, { useState } from "react"
import { ButtonGroup, Dropdown } from "react-bootstrap"

import apis from "../../services/apis"
import { errorMessage, successMessage } from "../../tools/toastify"

export default ({ aets = [], exportIds }) => {

    const [disabled, setDisabled] = useState(false)
    const [title, setTitle] = useState("Send To Modality")

    const handleClickDownload = async (event) => {
        let destinationAet = event.currentTarget.id

        try {
            await apis.aets.storeAET(destinationAet, exportIds)
            successMessage('Transfert Started')
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Failed')
            return;
        }

        /*
        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state) {
            if (state === MonitorJob.Success) {
                self.resetProgress()
                successMessage('DicomTransfer Done')

            } else if (state === MonitorJob.Failure) {
                self.resetProgress()
                errorMessage('DicomTransfer Failed')

            }
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
        */
    }

    /*
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
    */

    return (
        <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="button-dropdown-orange" className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic" disabled={disabled}>
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                {aets.map(aet => (<Dropdown.Item key={aet} id={aet} onClick={handleClickDownload} >{aet}</Dropdown.Item>))}
            </Dropdown.Menu>
        </Dropdown>

    )


}