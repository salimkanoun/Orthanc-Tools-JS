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

export default function ActionBouton(props) {

    const [showMetadata, setShowMetadata] = useState(false);
    const [hiddenMetadata, setHiddenMetadata] = useState(true);
    const [hiddenCreateDicom, setHiddenCreateDicom] = useState(false);


    const setMetadata = () => {
        setShowMetadata(!showMetadata)
    }

    const fdelete = async () => {
        console.log('props:')
        console.log(props)
        let orthancID = props.orthancID
        switch (props.level) {
            case 'patients':
                try {
                    await apis.content.deletePatient(orthancID)
                    toast.success("Patient " + orthancID + " have been deleted")
                    props.onDelete(orthancID, props.parentID)
                } catch (error) {
                    toast.error(error)
                }
                break
            case 'studies':
                try {
                    await apis.content.deleteStudies(orthancID)
                    toast.success("Studies " + orthancID + " have been deleted")
                    props.onDelete(orthancID, props.parentID)
                } catch (error) {
                    toast.error(error)
                }
                break
            case 'series':
                try {
                    await apis.content.deleteSeries(orthancID)
                    toast.success("Series " + orthancID + " have been deleted")
                    props.onDelete(orthancID, props.parentID)
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
                    <Metadata serieID={props.orthancID} />
                </Modal.Body>
            </Modal>

            <Dropdown onClick={handleClick} drop='left' className="text-center">
                <Dropdown.Toggle variant="button-dropdown-green" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Action
                </Dropdown.Toggle>

                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <OhifLink className='dropdown-item bg-green' {...props} />
                    <StoneLink className='dropdown-item bg-green' {...props} />
                    <Button className='dropdown-item bg-green' onClick={setMetadata}
                        hidden={hiddenMetadata}>View Metadata
                    </Button>
                    {(["patients", "studies"].includes(props.level) ? <CreateDicom {...props} /> :
                        null)}
                    <Modify hidden={props.hiddenModify} {...props} />
                    <Button className='dropdown-item bg-red' hidden={props.hiddenDelete}
                        onClick={fdelete}>Delete
                    </Button>
                    {(props.level === "studies" && !!props.openLabelModal ?
                        <Button className='dropdown-item bg-blue' hidden={props.hiddenDelete}
                            onClick={() => {
                                apis.content.getStudiesDetails(props.orthancID).then((study) => {
                                    props.openLabelModal(study)
                                })
                            }}>Labels
                        </Button> : null)}

                </Dropdown.Menu>
            </Dropdown>
        </Fragment>
    )
}