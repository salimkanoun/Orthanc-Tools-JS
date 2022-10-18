import React, { Component, Fragment, useState } from 'react'
import Modal from 'react-bootstrap/Modal';

import SelectRoles from './SelectRoles'

import apis from '../../../services/apis';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

export default ({ getUsers }) => {

    const [id, setId] = useState('')
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [superAdmin, setSuperAdmin] = useState(false)
    const [show, setShow] = useState(false)
    const [name, setName] = useState()

    const onRolesChange = (event) => {
        setRole(event.value)
    }

    const handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        setName(value)
    }

    const resetState = () => {
        setId('')
        setUsername('')
        setFirstname('')
        setLastname('')
        setEmail('')
        setRole('')
        setPassword('')
        setShow(false)
        getUsers()
    }

    const createUser = async () => {
        if (role === '' ||
            username === '' ||
            password === '') {
            toast.error('Please fill all required input')
        } else {

            try {
                await apis.User.createUser(username, firstname, lastname, password, email, role, superAdmin)
                resetState()
            } catch (error) {
                toast.error(error.statusText)
            }

        }
    }

    return (
        <Fragment>
            <Button name='create' className='otjs-button otjs-button-blue'
                onClick={() => setShow(true)}>New User
            </Button>
            <Modal id='create' show={show} onHide={resetState} size='md'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create User</h2>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <fieldset className="mt-3">
                            <label>Username*</label>
                            <input className='form-control' type='text' placeholder='username' name='username'
                                value={username} onChange={handleChange} required />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>First Name</label>
                            <input className='form-control' type='text' placeholder='First Name' name='firstname'
                                value={firstname} onChange={handleChange} />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>Last Name</label>
                            <input className='form-control' type='text' placeholder='Last Name' name='lastname'
                                value={lastname} onChange={handleChange} />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>Password*</label>
                            <input className='form-control' type='password' placeholder='password' name='password'
                                value={password} onChange={handleChange} required />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>Mail</label>
                            <input className='form-control' type='text' placeholder='example@example.com'
                                name='email' value={email} onChange={handleChange} />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>Super Admin</label>
                            <input className='form-check-input' type='checkbox' name='superAdmin'
                                value={superAdmin} onChange={handleChange} />
                        </fieldset>
                        <fieldset className="mt-3">
                            <label>Roles*</label>
                            <SelectRoles onChange={onRolesChange} />
                        </fieldset>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='otjs-button otjs-button-blue' onClick={createUser}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>

    );
}