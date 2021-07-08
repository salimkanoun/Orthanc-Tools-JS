import React, {Component} from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import {toast} from "react-toastify"

import apis from "../../services/apis"
import MonitorTask from "../../tools/MonitorTask"

const EXPORT_FAILED_TOAST = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export default class SendExternalDropdown extends Component {
    state = {
        disabled: false,
        title: "Send To Endpoint"
    }

    handleClickDownload = async (event) => {
        let endpointId = event.currentTarget.id

        let taskAnswer
        try {
            taskAnswer = await apis.exportDicom.exportStudiesToExternal(this.props.username, this.props.exportIds, endpointId)
        } catch (error) {
            toast.error(error.statusText)
        }

        let jobMonitoring = new MonitorTask(taskAnswer)

        let self = this
        jobMonitoring.onUpdate(function (info) {
            self.updateProgress(info)
        })

        jobMonitoring.onFinish(async function (info) {
            self.resetProgress()
            if (info.state === "failed") toast.error("Export to endpoint failed", EXPORT_FAILED_TOAST);
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    updateProgress = (info) => {
        this.setState({
            disabled: true,
            title: (['archiving', 'sending'].includes(info.state) ? info.state + ' ' + info.progress[info.state] + ' %' : info.state)
        })
    }

    resetProgress = () => {
        this.setState({
            disabled: false,
            title: "Send To Endpoint"
        })

    }

    render = () => {
        let dropDownItems = []
        this.props.endpoints.forEach(endpoint => {
            dropDownItems.push(<Dropdown.Item key={endpoint.id} id={endpoint.id}
                                              onClick={this.handleClickDownload}>{endpoint.label}</Dropdown.Item>)
        })
        return (
            <DropdownButton variant="success" disabled={this.state.disabled} title={this.state.title}>
                {dropDownItems}
            </DropdownButton>
        )
    }

}