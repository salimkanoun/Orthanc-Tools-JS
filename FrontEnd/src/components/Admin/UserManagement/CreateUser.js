import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { Button, Form, FormGroup, Row } from 'react-bootstrap';

import SelectRoles from './SelectRoles'
import apis from '../../../services/apis';
import { useCustomMutation } from '../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../model/Constant';

export default () => {

    const [id, setId] = useState('')
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [superAdmin, setSuperAdmin] = useState(false)
    const [show, setShow] = useState(false)

    const onRolesChange = (event) => {
        setRole(event.value)
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
    }

    const createUser = async () => {
        console.log('create')
        if (role === '' ||
            username === '' ||
            password === '') {
            toast.error('Please fill all required input', { data: { type: 'notification' } })
        } else {
            createUserMutation.mutate(username, firstname, lastname, password, email, role, superAdmin)
        }
    }

    const createUserMutation = useCustomMutation(
        ({ username, firstname, lastname, password, email, role, superAdmin }) => {
            apis.User.createUser(username, firstname, lastname, password, email, role, superAdmin)
            resetState()
        },
        [[keys.USERS_KEY]]
    )


    return (
        <>
            <Button name='create' className='otjs-button otjs-button-blue'
                onClick={() => setShow(true)}>New User
            </Button>
            <Modal id='create' show={show} onHide={resetState} size='md'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create User</h2>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <FormGroup>
                                <Form.Label>Username*</Form.Label>
                                <Form.Control type='text' placeholder='username' value={username} onChange={(event) => setUsername(event.target.value)} required />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type='text' placeholder='First Name' value={firstname} onChange={(event) => setFirstname(event.target.value)} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type='text' placeholder='Last Name' value={lastname} onChange={(event) => setLastname(event.target.value)} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>Password*</Form.Label>
                                <Form.Control type='password' placeholder='password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>Mail</Form.Label>
                                <Form.Control type='text' placeholder='example@example.com' value={email} onChange={(event) => setEmail(event.target.value)} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>Super Admin</Form.Label>
                                <Form.Check Check={superAdmin} onChange={(event) => setSuperAdmin(event.target.value)} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label>Roles*</Form.Label>
                                <SelectRoles onChange={onRolesChange} />
                            </FormGroup>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='otjs-button otjs-button-blue' onClick={createUser}>Create</Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}