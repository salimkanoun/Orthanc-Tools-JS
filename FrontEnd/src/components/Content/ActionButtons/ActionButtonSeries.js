import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import ConstantLevel from '../../Modify/ConstantLevel'
import Modify from '../../Modify/Modify'

export default ({
    orthancID,
    onDelete,
    dataDetails,
    onShowMetadata
}) => {
    const handleClick = (e) => {
        e.stopPropagation()
    }

    return (
        <Dropdown onClick={handleClick} drop='left' className="text-center">
            <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                Action
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Button className='dropdown-item bg-green' onClick={() => onShowMetadata()}>
                    View Metadata
                </Button>
                <Modify orthancID={orthancID} refresh={() => { console.log('TODO REFRESH') }} data={dataDetails} level={ConstantLevel.SERIES}/>
                <Button className='dropdown-item bg-red'
                    onClick={onDelete}>Delete
                </Button>
            </Dropdown.Menu>
        </Dropdown>
    )
}