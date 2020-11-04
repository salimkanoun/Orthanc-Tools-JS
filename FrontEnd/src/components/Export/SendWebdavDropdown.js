import React, { Component, Fragment } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from "../../services/apis"
import MonitorTask from "../../tools/ExportMonitorJob"
import MonitorJob from "../../tools/MonitorJob"

export default class SendWebdavDropdown extends Component{

    state = {
        disabled : false,
        title : "Send To Webdav"
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
    }

    async handleClickDownload(event){

        if (this.props.needConfirm) {this.props.setModal()}

        let taskAnswer =  await apis.webdav.storeWebdav(this.props.exportIds)
        let jobMonitoring = new MonitorTask(taskAnswer.id)

        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
            console.log("progress "+progress)
        })

        jobMonitoring.onFinish(async function (state){
            console.log("progress "+state)
            if(state === MonitorJob.Success){
                self.resetProgress()

            }else if (state === MonitorJob.Failure){
                self.resetProgress()
            }
        })

        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    updateProgress(progress){
        this.setState({
            disabled : true,
            title : 'Sending '+progress+ ' %'
        })
    }

    resetProgress(){
        this.setState({
            disabled : false,
            title : "Send To Webdav"
        })

    }

    componentWillUnmount(){
        if(this.job !== undefined) this.job.cancel()
    }

    render(){
/*
        let dropDownItems = []
        this.props.peers.forEach(peer => {
            let button = <button id={peer} type='button' className='btn btn-primary' onClick={this.handleClickDownload}>Continue Anyway</button>
            dropDownItems.push(<Dropdown.Item key={peer} id={peer} onClick={ this.props.needConfirm ? ()=>{this.props.setModal(); this.props.setButton(button)} : this.handleClickDownload } >{peer}</Dropdown.Item>)
        })
*/
        return (
            <Fragment>
                <button type='button' className="btn btn-info" onClick={this.handleClickDownload}>{this.state.title}</button>
            </Fragment>
        )
    }

}