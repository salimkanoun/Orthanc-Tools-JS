
import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';

import SelectRoles from './SelectRoles'

import apis from '../../../services/apis';
import { toast } from 'react-toastify';

export default class CreateUser extends Component {

    state = {
        data: {
            id: '',
            username: '',
            firstname: '',
            lastname: '',
            mail: '',
            role: '',
            password: ''
        },
        show: false
    }

    onRolesChange = (event) => {
        this.setState(prevState => {
            return {
                data: {
                    ...prevState.data,
                    role: event.value
                }
            }
        })
    }

    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]: value
            }
        }))
    }

    resetState = () => {
        this.setState({
            data: {
                id: '',
                username: '',
                firstName: '',
                lastName: '',
                mail: '',
                role: '',
                password: ''
            },
            show: false
        })
        this.props.getUsers()
    }

    createUser = async () => {
        if (this.state.data.role === '' ||
            this.state.data.username === '' ||
            this.state.data.password === '') {
            toast.error('Please fill all required input')
        } else {
            await apis.User.createUser(this.state.data)
            this.resetState()
        }
    }

    render() {
        return (
            <Fragment>
                <button type='button' name='create' className='btn btn-primary float-right mb-3' onClick={() => this.setState({ show: true })}>New User</button>
                <Modal id='create' show={this.state.show} onHide={this.resetState} size='md'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create User</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <fieldset>
                                <label>Username*</label>
                                <input className='form-control' type='text' placeholder='username' name='username' value={this.state.data.username} onChange={this.handleChange} required />
                            </fieldset>

                            <fieldset>
                                <label>First Name</label>
                                <input className='form-control' type='text' placeholder='First Name' name='firstName' value={this.state.data.firstName} onChange={this.handleChange} />
                            </fieldset>

                            <fieldset>
                                <label>Last Name</label>
                                <input className='form-control' type='text' placeholder='Last Name' name='lastName' value={this.state.data.lastName} onChange={this.handleChange} />
                            </fieldset>

                            <fieldset>
                                <label>Password*</label>
                                <input className='form-control' type='password' placeholder='password' name='password' value={this.state.data.password} onChange={this.handleChange} required />
                            </fieldset>

                            <fieldset>
                                <label>Mail</label>
                                <input className='form-control' type='text' placeholder='example@example.com' name='mail' value={this.state.data.mail} onChange={this.handleChange} />
                            </fieldset>

                            <fieldset>
                                <label>Roles*</label>
                                <SelectRoles onChange={this.onRolesChange} />
                            </fieldset>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-primary' onClick={this.createUser}>Create</button>
                        <button type='button' className='btn btn-info' onClick={this.resetState}>Close</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>

        );
    }
}