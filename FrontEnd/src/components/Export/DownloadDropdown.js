import React from "react"
import { Dropdown } from "react-bootstrap"

import { errorMessage } from "../../tools/toastify"
import apis from '../../services/apis'

export default ({ exportIds, TS }) => {

    const handleClickDownload = async (hirarchical) => {
        try {
            if (hirarchical) {
                apis.exportDicom.exportHirachicalDicoms(exportIds, TS)
            } else {
                apis.exportDicom.exportDicomDirDicoms(exportIds, TS)
            }
        } catch (error) {
            errorMessage(error?.data?.errorMessage)
        }
    }

    return (
        <Dropdown >
            <Dropdown.Toggle variant="button-dropdown-blue" className="button-dropdown button-dropdown-blue w-7">
                Download
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Dropdown.Item id='hirarchical' onClick={() => handleClickDownload(true)}>
                    Hirarchical
                </Dropdown.Item>
                <Dropdown.Item id='dicomdir' onClick={() => handleClickDownload(false)}>
                    Dicomdir
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    )
}