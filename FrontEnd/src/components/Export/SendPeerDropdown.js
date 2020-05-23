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
        show: false
    }

    constructor(props){
        super(props)
        this.handleClickDownload = this.handleClickDownload.bind(this)
        this.setModal = this.setModal.bind(this)
    }

    async handleClickDownload(event){
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

    setModal(){
        this.setState({show: !this.state.show})
    }

    componentWillMount(){
        if(this.job !== undefined) this.job.cancel()
    }

    render(){

        let dropDownItems = []
        let dropDownItemsDefault = []
        this.props.peers.forEach(peer => {
            dropDownItems.push(<Dropdown.Item key={peer} id={peer} onClick={ this.props.needConfirm ? this.setModal : this.handleClickDownload } >{peer}</Dropdown.Item>)
            dropDownItemsDefault.push(<Dropdown.Item key={peer} id={peer} onClick={ this.handleClickDownload } >{peer}</Dropdown.Item>)
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
                        some studies are not anonymized !
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={this.setModal}>Cancel</button>
                        <DropdownButton variant="success" disabled={this.state.disabled} title = {this.state.title}>
                            {dropDownItemsDefault}
                        </DropdownButton>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        )
    }

}