import React from "react"
import { Dropdown } from "react-bootstrap"

import { errorMessage, successMessage } from "../../tools/toastify"
import { jobMessageToNotificationCenter } from "../../tools/toastify"
import apis from "../../services/apis"

export default ({ aets = [], exportIds }) => {

    const handleClickDownload = async (event) => {
        let destinationAet = event.currentTarget.id

        try {
            let answer = await apis.aets.storeAET(destinationAet, exportIds)
            jobMessageToNotificationCenter('Send to Modality', { ID: answer.ID, modality: destinationAet })
            successMessage('Transfert Started')
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Failed')
            return;
        }

    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="button-dropdown-orange" className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic">
                Send To Modality
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                {aets.map(aet => (<Dropdown.Item key={aet} id={aet} onClick={handleClickDownload} >{aet}</Dropdown.Item>))}
            </Dropdown.Menu>
        </Dropdown>
    )
}