import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { toastifyError } from '../../../services/toastify'

import RoleForm from './RoleForm'
import apis from '../../../services/apis'


export default class CreateRole extends Component {
    state = {
        show: false,
        name: ''
    }

    create = async (formState) => {
        if (this.state.name === '') {
            toastifyError('Role name can\'t be empty')
        } else {
            let permission = { ...formState, name: this.state.name }
            apis.role.createRole(permission).then(() => {
                this.setState({
                    show: false,
                    name: ''
                })
                this.props.onSubmitRole()
            }).catch(error => console.log(error))
        }
    }

    render = () => {
        return (
            <Fragment>
                <button type='button' className='btn btn-primary mb-3 float-right' onClick={() => this.setState({ show: true })} >New Role</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new role</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Name*</label>
                        <input className='form-control mb-4' type='text' placeholder='name' name='name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
                        <RoleForm onSubmitRole={this.create} />
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }
}