import React from "react"
import { Dropdown } from "react-bootstrap";

import { errorMessage, jobMessageToNotificationCenter } from "../../tools/toastify";
import apis from "../../services/apis"

export default ({ peers, exportIds }) => {

    const handleClickDownload = async (destinationPeer) => {
        try {
            let answer = await apis.peers.storePeer(destinationPeer, exportIds)
            jobMessageToNotificationCenter('Send to Peer', { ID: answer.ID, Peer: destinationPeer })
        } catch (error) {
            errorMessage(error?.data?.errorMessage)
            return
        }
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="button-dropdown-orange" className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic">
                Send To Peer
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                {peers.map(peer => (
                    <Dropdown.Item
                        key={peer}
                        onClick={() => handleClickDownload(peer)} >
                        {peer}
                    </Dropdown.Item>))
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}