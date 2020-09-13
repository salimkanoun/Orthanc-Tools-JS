import React, { Component, Fragment } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from "../../services/apis"
import MonitorJob from "../../tools/MonitorJob"

export default class SendPeerDropdown extends Component{

    state = {
        disabled : false,
        title : "Send To Peer"
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
    }

    async handleClickDownload(event){

        if (this.props.needConfirm) {this.props.setModal()}

        let destinationPeer =event.currentTarget.id
        let jobAnswer = await apis.peers.storePeer(destinationPeer, this.props.exportIds)

        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state){
            if(state === MonitorJob.Success){
                self.resetProgress()
                //SK Altertify?

            }else if (state === MonitorJob.Failure){
                self.resetProgress()
                //SK Altertify?

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
            title : "Send To Peer"
        })

    }

    componentWillUnmount(){
        if(this.job !== undefined) this.job.cancel()
    }

    render(){

        let dropDownItems = []
        this.props.peers.forEach(peer => {
            let button = <button id={peer} type='button' className='btn btn-primary' onClick={this.handleClickDownload}>Continue Anyway</button>
            dropDownItems.push(<Dropdown.Item key={peer} id={peer} onClick={ this.props.needConfirm ? ()=>{this.props.setModal(); this.props.setButton(button)} : this.handleClickDownload } >{peer}</Dropdown.Item>)
        })

        return (
            <Fragment>
                <DropdownButton variant="success" disabled={this.state.disabled} title = {this.state.title}>
                    {dropDownItems}
                </DropdownButton>
            </Fragment>
            
        )
    }

}