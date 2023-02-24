import React, { useState } from "react"
import { Button, Form, FormGroup, Modal, Row } from "react-bootstrap"
import SelectRoles from "../SelectRoles"

export default ({ show, data = {}, modify = false, create = false, queryFunction }) => {

    const [state, setState] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        superAdmin: false,
    })

    const [role, setRole] = useState('')

    if (modify) {
        console.log(modify)
        console.log(data)
        setState(...data)
        setRole(data.role)
    }

    const onRolesChange = (event) => {
        setRole(event.value)
    }

    const onChange = (key, event) => {
        setState((state) => ({
            ...state,
            [key]: event
        })
        )
    }

    const resetState = () => {
        setState({
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            superAdmin: false,
        })
        setRole('')
    }

    return (
        <>
        <Modal id='create' show={show} onHide={resetState} size='md'>
            <Modal.Header closeButton>
            {
                modify ?
                <h2 className='card-title'>Modify User</h2>
                : null
            }
            {
                create ?
                <h2 className='card-title'>Create User</h2>
                : null
            }
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <FormGroup>
                            <Form.Label>Username*</Form.Label>
                            <Form.Control type='text' placeholder='username' value={state.username} onChange={(event) => onChange('username', event.target.value)} required />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type='text' placeholder='First Name' value={state.firstname} onChange={(event) => onChange('firstname', event.target.value)} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type='text' placeholder='Last Name' value={state.lastname} onChange={(event) => onChange('lastname', event.target.value)} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>Password*</Form.Label>
                            <Form.Control type='password' placeholder='password' value={state.password} onChange={(event) => onChange('password', event.target.value)} required />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>Mail</Form.Label>
                            <Form.Control type='text' placeholder='example@example.com' value={state.email} onChange={(event) => onChange('email', event.target.value)} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>Super Admin</Form.Label>
                            <Form.Check Check={state.superAdmin} onChange={(event) => onChange('superAdmin', event.target.value)} />
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
                <Button className='otjs-button otjs-button-blue' onClick={queryFunction(state, role)}>Create</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}