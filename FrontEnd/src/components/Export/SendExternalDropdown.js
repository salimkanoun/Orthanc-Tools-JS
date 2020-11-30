import React, { Component} from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from "../../services/apis"
import MonitorTask from "../../tools/MonitorTask"

export default class SendExternalDropdown extends Component{

    state = {
        disabled : false,
        title : "Send To Endpoint"
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
    }

    async handleClickDownload(event){
        let endpointId = event.currentTarget.id

        let taskAnswer =  await apis.exportToExternal.exportStudiesToExternal(this.props.username, this.props.exportIds, endpointId)
        let jobMonitoring = new MonitorTask(taskAnswer.id)

        let self = this
        jobMonitoring.onUpdate(function (info) {
            self.updateProgress(info)
        })

        jobMonitoring.onFinish(async function (info){
            self.resetProgress()
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    updateProgress(info){
        this.setState({
            disabled : true,
            title : (['archiving','sending'].includes(info.state) ? info.state+' '+info.progress[info.state]+ ' %' : info.state)
        })
    }

    resetProgress(){
        this.setState({
            disabled : false,
            title : "Send To Endpoint"
        })

    }

    render(){
        let dropDownItems = []
        this.props.endpoints.forEach(endpoint => {
            dropDownItems.push(<Dropdown.Item key={endpoint.id} id={endpoint.id} onClick={ this.handleClickDownload } >{endpoint.label}</Dropdown.Item>)
        })
        return (
            <DropdownButton variant="success" disabled={this.state.disabled} title = {this.state.title}>
                {dropDownItems}
            </DropdownButton>
        )
    }

}