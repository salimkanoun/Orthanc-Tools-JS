import React from 'react'

import { ButtonGroup, Dropdown } from 'react-bootstrap'

import { send_type } from '../../../model/Constant'

export default ({onSendTo}) => {

    
    const handleClick = (e) => {
        e.stopPropagation()
    }


    return (
        <Dropdown as={ButtonGroup} onClick={handleClick}>
            <Dropdown.Toggle variant="button-dropdown-orange" className="mb-4 button-dropdown button-dropdown-orange" id="dropdown-basic">
                Send To
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Dropdown.Item className='bg-blue' onClick={() => onSendTo()}>Export List</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='bg-orange' onClick={() => onSendTo(send_type.ANON)}>Anonymize List</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='bg-red' onClick={() => onSendTo(send_type.DELETE)}>Delete List</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}