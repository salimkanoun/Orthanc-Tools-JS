import React, { Fragment } from "react";
import { Button, Dropdown } from "react-bootstrap";

import apis from "../../../services/apis";
import { errorMessage, successMessage } from "../../../tools/toastify";
import CreateDicom from "../../CreateDicom/CreateDicom";
import Modify from "../../Modify/Modify";

export default ({
    orthancID,
    onDelete,
    dataDetails
}) => {
    const onDeleteHandle = async () => {
        try {
            await apis.content.deletePatient(orthancID)
            successMessage("Patient " + orthancID + " have been deleted")
            onDelete(orthancID)
        } catch (error) {
            errorMessage(error)
        }
    }


    const handleClick = (e) => {
        e.stopPropagation()
    }


    return (
        <Fragment>
            <Dropdown onClick={handleClick} drop='left' className="text-center">
                <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Action
                </Dropdown.Toggle>

                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <CreateDicom orthancID={orthancID} />
                    <Modify orthancID={orthancID} refresh={() => { console.log('TODO REFRESH') }} data={dataDetails} />
                    <Button className='dropdown-item bg-red' onClick={onDeleteHandle}>
                        Delete
                    </Button>
                </Dropdown.Menu>
            </Dropdown>
        </Fragment>
    )
}