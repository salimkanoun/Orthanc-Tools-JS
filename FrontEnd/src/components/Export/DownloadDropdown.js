import React, { Component } from "react"
import { Dropdown, ButtonGroup } from "react-bootstrap"
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
            <Dropdown as={ButtonGroup} onClick={this.handleRootClick}>
                <Dropdown.Toggle variant="button-dropdown-blue" className="button-dropdown button-dropdown-blue w-7" id="dropdown-basic" disabled={this.state.disabled}>
                    {this.state.buttonText}
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <Dropdown.Item id='hirarchical' onClick={this.handleClickDownload}>
                        Hirarchical
                    </Dropdown.Item>
                    <Dropdown.Item id='dicomdir' onClick={this.handleClickDownload}>
                        Dicomdir
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        )
    }


}