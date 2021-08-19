import React, {Component, Fragment} from 'react'
import Modal from 'react-bootstrap/Modal';

import SelectRoles from './SelectRoles'

import apis from '../../../services/apis';
import {toast} from 'react-toastify';

export default class CreateUser extends Component {

    state = {
        id: '',
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        password: '',
        superAdmin: false,
        show: false

    }

    onRolesChange = (event) => {
        this.setState(prevState => {
            return {
                ...prevState,
                role: event.value
            }
        })
    }

    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState(prevState => ({
            ...prevState.data,
            [name]: value
        }))
    }

    resetState = () => {
        this.setState(
            {
                id: '',
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                password: '',
                show: false
            }
        )
        this.props.getUsers()
    }

    createUser = async () => {
        if (this.state.role === '' ||
            this.state.username === '' ||
            this.state.password === '') {
            toast.error('Please fill all required input')
        } else {

            try {
                await apis.User.createUser(this.state.username, this.state.firstname, this.state.lastname, this.state.password, this.state.email, this.state.role, this.state.superAdmin)
                this.resetState()
            } catch (error) {
                toast.error(error.statusText)
            }

        }
    }

    render() {
        return (
            <Fragment>
                <button type='button' name='create' className='otjs-button otjs-button-blue'
                        onClick={() => this.setState({show: true})}>New User
                </button>
                <Modal id='create' show={this.state.show} onHide={this.resetState} size='md'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create User</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <fieldset className="mt-3">
                                <label>Username*</label>
                                <input className='form-control' type='text' placeholder='username' name='username'
                                       value={this.state.username} onChange={this.handleChange} required/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>First Name</label>
                                <input className='form-control' type='text' placeholder='First Name' name='firstname'
                                       value={this.state.firstname} onChange={this.handleChange}/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>Last Name</label>
                                <input className='form-control' type='text' placeholder='Last Name' name='lastname'
                                       value={this.state.lastname} onChange={this.handleChange}/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>Password*</label>
                                <input className='form-control' type='password' placeholder='password' name='password'
                                       value={this.state.password} onChange={this.handleChange} required/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>Mail</label>
                                <input className='form-control' type='text' placeholder='example@example.com'
                                       name='email' value={this.state.email} onChange={this.handleChange}/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>Super Admin</label>
                                <input className='form-check-input' type='checkbox' name='superAdmin'
                                       value={this.state.superAdmin} onChange={this.handleChange}/>
                            </fieldset>
                            <fieldset className="mt-3">
                                <label>Roles*</label>
                                <SelectRoles onChange={this.onRolesChange}/>
                            </fieldset>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='otjs-button otjs-button-blue' onClick={this.createUser}>Create</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>

        );
    }
}