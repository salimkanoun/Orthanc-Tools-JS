import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'


class CreateCorrespondence extends Component {
    state = { 
        show: false, 
    }

    constructor(props){
        super(props)
        this.create = this.create.bind(this)
    }

    async create(){
            await apis.ldap.createCorrespondence().then(()=>{
                this.setState({
                    show: false, 
                })
                this.props.getRoles()
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <Fragment>
                <button type='button' hidden={!this.props.getState()} className='btn btn-primary mr-3 mt-2' onClick={() => this.setState({show: true})} >New correspondence</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new correspondence</h2>
                    </Modal.Header>
                    <Modal.Body>   
                        <label>Name*</label>
                        <input className='form-control mb-4' type='text' placeholder='name' name='name' value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required />
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({show: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        );
    }
}

export default CreateCorrespondence;