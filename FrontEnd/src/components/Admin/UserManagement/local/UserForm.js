import React, { useEffect, useState } from "react"
import { Form, FormGroup, Row } from "react-bootstrap"
import SelectRoles from "../SelectRoles"

export default ({ data = {}, children, onValidate }) => {

    const [state, setState] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        superAdmin: false,
    })

    const [role, setRole] = useState('')

    useEffect(() => {
        setState({ ...data })
        setRole(data.role)
    }, [JSON.stringify(data)])


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

    return (
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
            <Row>
                <div className="d-flex justify-content-end" onClick={() => onValidate({ ...state, role })}>
                    {children}
                </div>
            </Row>
        </Form>
    )
}