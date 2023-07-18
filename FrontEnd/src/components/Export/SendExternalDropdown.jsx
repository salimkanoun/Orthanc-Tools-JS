import React from "react"

import { Dropdown } from "react-bootstrap"

import apis from "../../services/apis"
import { errorMessage } from "../../tools/toastify"

export default ({ endpoints }) => {

    const handleClickDownload = async (event) => {
        let endpointId = event.currentTarget.id

        let taskAnswer
        try {
            taskAnswer = await apis.exportDicom.exportStudiesToExternal(this.props.username, this.props.exportIds, endpointId)
        } catch (error) {
            errorMessage(error?.data?.statusText ?? "Error Sending")
        }
    }

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="button-dropdown-orange"
                    className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic"
                    disabled={true}>
                    Send To Endpoint
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    {
                        endpoints.map(endpoint => (
                            <Dropdown.Item key={endpoint.id}
                                onClick={() => handleClickDownload(endpoint.id)}>
                                {endpoint.label}
                            </Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )

}