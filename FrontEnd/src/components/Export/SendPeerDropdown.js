import React, { Component, Fragment } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import apis from "../../services/apis"
import MonitorJob from "../../tools/MonitorJob"
import Modal from "react-bootstrap/Modal"

export default class SendPeerDropdown extends Component{

    state = {
        disabled : false,
        title : "Send To Peer",
        show: false, 
        currentID: ''
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
        this.setModal = this.setModal.bind(this)
    }

    async handleClickDownload(event){
        let destinationPeer =event.currentTarget.id
        console.log(destinationPeer)
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

    setModal(event){
        this.setState({show: !this.state.show, currentID: event ? event.currentTarget.id : ''})
    }

    componentWillMount(){
        if(this.job !== undefined) this.job.cancel()
    }

    render(){

        let dropDownItems = []
        this.props.peers.forEach(peer => {
            dropDownItems.push(<Dropdown.Item key={peer} id={peer} onClick={ this.props.needConfirm ? this.setModal : this.handleClickDownload } >{peer}</Dropdown.Item>)
        })

        return (
            <Fragment>
                <DropdownButton variant="success" disabled={this.state.disabled} title = {this.state.title}>
                    {dropDownItems}
                </DropdownButton>

                <Modal show={this.state.show} onHide={this.setModal} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm export</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Some studies are not anonymized !
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={this.setModal}>Cancel</button>
                        <button id={this.state.currentID} type='button' className='btn btn-primary' onClick={this.handleClickDownload}>Continue Anyway</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        )
    }

}