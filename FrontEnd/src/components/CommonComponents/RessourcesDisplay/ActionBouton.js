import React, { Component, Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'
import { toastifySuccess, toastifyError } from '../../../services/toastify'
import OhifLink from '../../Ohif/OhifLink'
import Modal from 'react-bootstrap/Modal'
import Metadata from '../../Metadata/Metadata'
import Modify from '../../Modify/Modify'

class ActionBouton extends Component{

    state = {
        showMetadata: false
    }

    constructor(props){
        super(props)
        this.delete = this.delete.bind(this)
        this.setMetadata = this.setMetadata.bind(this)
    }

    static defaultProps = {
        hiddenMetadata: true
    }

    setMetadata(){
        this.setState({
            showMetadata: !this.state.showMetadata
        })
    }

    async delete( ) {
        let orthancID = this.props.orthancID
        switch(this.props.level){
            case 'patient':
                await apis.content.deletePatient(orthancID)
                toastifySuccess("Patient " + orthancID + " have been deleted")
                break
            case 'studies':
                await apis.content.deleteStudies(orthancID)
                toastifySuccess("Studies " + orthancID + " have been deleted")
                break
            case 'series':
                await apis.content.deleteSeries(orthancID)
                toastifySuccess("Series " + orthancID + " have been deleted")
                break
            default:
                toastifyError("Wrong level")
        }
        this.props.onDelete(orthancID, this.props.parentID)
    }

    handleClick(e){
        e.stopPropagation()
    }

    render(){
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

                <Dropdown onClick={this.handleClick}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"  >
                        Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <OhifLink className='dropdown-item bg-info' {...this.props} />
                        <Modify {...this.props} />
                        <button className='dropdown-item bg-danger' type='button' onClick={ this.delete }>Delete</button>
                        <button className='dropdown-item bg-info' type='button' onClick={ this.setMetadata} hidden={this.props.hiddenMetadata}>Metadata</button>
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
            )
    }


}

export default ActionBouton