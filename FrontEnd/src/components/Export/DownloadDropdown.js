import React, { Component, useState } from "react"
import { Dropdown, ButtonGroup } from "react-bootstrap"
import { toast } from "react-toastify"

import apis from '../../services/apis'

export default ({exportIds, TS}) => {

    const [buttonText, setButtonText] = useState("Download")
    const [disabled, setDisabled] = useState(false)

    const updateProgress = (progress) => {
        setButtonText("Preparing Zip " + progress + "%")
        setDisabled(true)
    }

    const setStatusDownloading = () => {
        setButtonText("Downloading")
        setDisabled(true)
    }

    const resetProgress = () => {
        setButtonText("Download")
        setDisabled(false)
    }

    const handleRootClick = (e) => {
        e.stopPropagation()
    }

    const handleClickDownload = async (e) => {
        e.stopPropagation()

        try{
            if (e.currentTarget.id === 'hirarchical') {
                apis.exportDicom.downloadZipSync(exportIds, TS, false)
            } else {
                apis.exportDicom.downloadZipSync(exportIds, TS, true)
            }
        } catch (error){
            toast.error(error.statusText)
        }
    }


        return (
            <Dropdown as={ButtonGroup} onClick={handleRootClick}>
                <Dropdown.Toggle variant="button-dropdown-blue" className="button-dropdown button-dropdown-blue w-7" id="dropdown-basic" disabled={disabled}>
                    {buttonText}
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <Dropdown.Item id='hirarchical' onClick={handleClickDownload}>
                        Hirarchical
                    </Dropdown.Item>
                    <Dropdown.Item id='dicomdir' onClick={handleClickDownload}>
                        Dicomdir
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        )
}