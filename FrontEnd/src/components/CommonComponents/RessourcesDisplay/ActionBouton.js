import React, { Component, Fragment, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'

import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'
import Modal from 'react-bootstrap/Modal'
import Metadata from '../../Metadata/Metadata'
import Modify from '../../Modify/Modify'
import { toast } from 'react-toastify'
import CreateDicom from '../../CreateDicom/CreateDicom'
import { Button } from 'react-bootstrap'
import ConstantLevel from '../../Modify/ConstantLevel'
 
export default ({
    level,
    orthancID,
    StudyInstanceUID,
    dataDetails,
    hiddenModify,
    hiddenDelete,
    onDelete,
    openLabelModal }) => {

    const [showMetadata, setShowMetadata] = useState(false);
    const [hiddenMetadata, setHiddenMetadata] = useState(true);

    const setMetadata = () => {
        setShowMetadata(!showMetadata)
    }

    const fdelete = async () => {
        switch (level) {
            case ConstantLevel.PATIENTS:
                try {
                    await apis.content.deletePatient(orthancID)
                    toast.success("Patient " + orthancID + " have been deleted")
                    onDelete(orthancID)
                } catch (error) {
                    toast.error(error)
                }
                break
            case ConstantLevel.STUDIES:
                try {
                    await apis.content.deleteStudies(orthancID)
                    toast.success("Studies " + orthancID + " have been deleted")
                    onDelete(orthancID)
                } catch (error) {
                    toast.error(error)
                }
                break
            case ConstantLevel.SERIES:
                try {
                    await apis.content.deleteSeries(orthancID)
                    toast.success("Series " + orthancID + " have been deleted")
                    onDelete(orthancID)
                } catch (error) {
                    toast.error(error)
                }
                break
            default:
                toast.error("Wrong level")
        }

    }

    const handleClick = (e) => {
        e.stopPropagation()
    }


    return (
        <Fragment>
            {/*modal pour metadata*/}
            <Modal show={showMetadata} onHide={setMetadata} scrollable={true} >
                <Modal.Header closeButton>
                    <Modal.Title>Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Metadata serieID={orthancID} />
                </Modal.Body>
            </Modal>

            <Dropdown onClick={handleClick} drop='left' className="text-center">
                <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Action
                </Dropdown.Toggle>

                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <OhifLink className='dropdown-item bg-green' StudyInstanceUID={StudyInstanceUID} />
                    <StoneLink className='dropdown-item bg-green' StudyInstanceUID={StudyInstanceUID} />
                    <Button className='dropdown-item bg-green' onClick={setMetadata}
                        hidden={hiddenMetadata}>View Metadata
                    </Button>
                    {([ConstantLevel.PATIENTS, ConstantLevel.STUDIES].includes(level) ? <CreateDicom orthancID={orthancID} level={level} /> :
                        null)}
                    <Modify hidden={hiddenModify} orthancID={orthancID} level={level} data={dataDetails} refresh={()=>{console.log('TODO REFRESH')}} />
                    <Button className='dropdown-item bg-red' hidden={hiddenDelete}
                        onClick={fdelete}>Delete
                    </Button>
                    {(level === ConstantLevel.STUDIES && !!openLabelModal ?
                        <Button className='dropdown-item bg-blue' hidden={hiddenDelete}
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