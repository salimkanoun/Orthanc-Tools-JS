import React, { Component } from "react"
import {Dropdown, ButtonGroup} from "react-bootstrap";
import { toast } from "react-toastify"

import apis from "../../services/apis"
import MonitorJob from "../../tools/MonitorJob"

export default class SendPeerDropdown extends Component {

    state = {
        disabled: false,
        title: "Send To Peer"
    }

    handleClickDownload = async (event) => {

        if (this.props.needConfirm) { this.props.setModal() }

        let destinationPeer = event.currentTarget.id
        let jobAnswer
        try{
            jobAnswer = await apis.peers.storePeer(destinationPeer, this.props.exportIds)
        }catch(error){
            toast.error(error.statusText)
            return
        }


        let jobMonitoring = new MonitorJob(jobAnswer.ID)
        let self = this
        jobMonitoring.onUpdate(function (progress) {
            self.updateProgress(progress)
        })

        jobMonitoring.onFinish(async function (state) {
            if (state === MonitorJob.Success) {
                self.resetProgress()
                toast.success('Peer Trasnfer Success')

            } else if (state === MonitorJob.Failure) {
                self.resetProgress()
                toast.error('Peer Transfer Error')

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
            title: "Send To Peer"
        })

    }

    componentWillUnmount = () => {
        if (this.job !== undefined) this.job.cancel()
    }

    render = () => {

        let dropDownItems = []
        this.props.peers.forEach(peer => {
            let button = <button id={peer} type='button' className='btn btn-primary' onClick={this.handleClickDownload}>Continue Anyway</button>
            dropDownItems.push(<Dropdown.Item key={peer} id={peer} onClick={this.props.needConfirm ? () => { this.props.setModal(); this.props.setButton(button) } : this.handleClickDownload} >{peer}</Dropdown.Item>)
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