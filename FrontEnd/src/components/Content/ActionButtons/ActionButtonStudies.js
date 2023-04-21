import React, { Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { Button } from 'react-bootstrap'

import apis from '../../../services/apis'
import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'

export default ({
    orthancID,
    StudyInstanceUID,
    onDelete,
    openLabelModal,
    onShowModify
}) => {

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
                    <OhifLink className='dropdown-item bg-green' StudyInstanceUID={StudyInstanceUID} />
                    <StoneLink className='dropdown-item bg-green' StudyInstanceUID={StudyInstanceUID} />
                    <Button className='dropdown-item bg-orange' onClick={() => onShowModify()}>
                        Modify
                    </Button>
                    <Button className='dropdown-item bg-red'
                        onClick={() => onDelete()}>Delete
                    </Button>
                    {(!!openLabelModal ?
                        //TODO a réinstancier
                        <Button className='dropdown-item bg-blue'
                            onClick={() => {
                                apis.content.getStudiesDetails(orthancID).then((study) => {
                                    openLabelModal(study)
                                })
                            }}>Labels
                        </Button> : null)}

                </Dropdown.Menu>
            </Dropdown>
        </Fragment>
    )
}