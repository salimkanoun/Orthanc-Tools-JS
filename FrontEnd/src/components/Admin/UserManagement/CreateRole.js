import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { toastifyError } from '../../../services/toastify'

import RoleForm from './RoleForm'
import apis from '../../../services/apis'


class CreateRole extends Component {
    state = { 
        show: false, 
        name: ''
    }

    constructor(props){
        super(props)
        this.child = React.createRef()
        this.create = this.create.bind(this)
    }

    async create(){
        if (this.state.name === ''){
            toastifyError('Role name can\'t be empty')
        } else {
            let permission = {...this.child.current.getState(), name: this.state.name}
            await apis.role.createRole(permission).then(()=>{
                this.setState({
                    show: false, 
                    name: ''
                })
                this.props.getRoles()
            }).catch(error => console.log(error))
        }
    }

    render() {
        return (
            <Fragment>
                <button type='button' className='btn btn-primary mb-3 float-right' onClick={() => this.setState({show: true})} >New Role</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new role</h2>
                    </Modal.Header>
                    <Modal.Body>   
                        <label>Name*</label>
                        <input className='form-control mb-4' type='text' placeholder='name' name='name' value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required />
                        <RoleForm ref={this.child} />
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

export default CreateRole;