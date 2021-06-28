import React, { Component } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import { toast } from "react-toastify"

import apis from '../../services/apis'

export default class DownloadDropdown extends Component {

    state = {
        buttonText: "Download",
        disabled: false
    }

    updateProgress = (progress) => {
        this.setState({
            buttonText: "Preparing Zip " + progress + "%",
            disabled: true
        })
    }

    setStatusDownloading = () => {
        this.setState({
            buttonText: "Downloading",
            disabled: true
        })
    }

    resetProgress = () => {
        this.setState({
            buttonText: "Download",
            disabled: false
        })
    }

    handleRootClick = (e) => {
        e.stopPropagation()
    }

    handleClickDownload = async (e) => {
        e.stopPropagation()

        try{
            if (e.currentTarget.id === 'hirarchical') {
                apis.exportDicom.downloadZipSync(this.props.exportIds, this.props.TS, false)
            } else {
                apis.exportDicom.downloadZipSync(this.props.exportIds, this.props.TS, true)
            }
        } catch (error){
            toast.error(error.statusText)
        }
    }

    render = () => {

        return (
            <DropdownButton onClick={this.handleRootClick} variant="success" disabled={this.state.disabled} title={this.state.buttonText}>
                <Dropdown.Item id='hirarchical' onClick={this.handleClickDownload}>
                    Hirarchical
                </Dropdown.Item>
                <Dropdown.Item id='dicomdir' onClick={this.handleClickDownload}>
                    Dicomdir
                </Dropdown.Item>
            </DropdownButton>
        )
    }


}