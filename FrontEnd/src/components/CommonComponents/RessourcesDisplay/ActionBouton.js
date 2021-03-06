import React, { Component, Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'

import OhifLink from '../../Viewers/OhifLink'
import StoneLink from '../../Viewers/StoneLink'
import Modal from 'react-bootstrap/Modal'
import Metadata from '../../Metadata/Metadata'
import Modify from '../../Modify/Modify'
import { toast } from 'react-toastify'
export default class ActionBouton extends Component{

    state = {
        showMetadata: false
    }

    static defaultProps = {
        hiddenMetadata: true
    }

    setMetadata = () => {
        this.setState({
            showMetadata: !this.state.showMetadata
        })
    }

    delete = async () => {
        let orthancID = this.props.orthancID
        switch(this.props.level){
            case 'patients':
                await apis.content.deletePatient(orthancID)
                toast.success("Patient " + orthancID + " have been deleted")
                break
            case 'studies':
                await apis.content.deleteStudies(orthancID)
                toast.success("Studies " + orthancID + " have been deleted")
                break
            case 'series':
                await apis.content.deleteSeries(orthancID)
                toast.success("Series " + orthancID + " have been deleted")
                break
            default:
                toast.error("Wrong level")
        }
        this.props.onDelete(orthancID, this.props.parentID)
    }

    handleClick = (e) => {
        e.stopPropagation()
    }

    render = () => {
        return (
            <Fragment>
                {/*modal pour metadata*/}
                <Modal show={this.state.showMetadata} onHide={this.setMetadata} scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Metadata</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <Metadata serieID={this.props.orthancID} />
                    </Modal.Body>
                </Modal>

                <Dropdown onClick={this.handleClick} drop='left'>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"  >
                        Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <OhifLink className='dropdown-item bg-info' {...this.props} />
                        <StoneLink className='dropdown-item bg-info' {...this.props} />
                        <button className='dropdown-item bg-info' type='button' onClick={ this.setMetadata} hidden={this.props.hiddenMetadata}>View Metadata</button>
                        <Modify {...this.props} />
                        <button className='dropdown-item bg-danger' type='button' onClick={ this.delete }>Delete</button>
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
            )
    }


}