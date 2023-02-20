import React, { Fragment, useState } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'

import RoleForm from './RoleForm'
import apis from '../../../services/apis'
import { toast } from 'react-toastify'


export default ({ onSubmitRole }) => {

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')


    const create = async (formState) => {
        if (name === '') {
            toast.error('Role name can\'t be empty', {data:{type:'notification'}})
        } else {
            let permission = { ...formState, name: name }
            apis.role.createRole(permission).then(() => {
                setShow(false)
                setName('')
                toast.success('Crated Role')
                onSubmitRole()
            }).catch(error => toast.error(error.statusText, {data:{type:'notification'}}))
        }
    }

    return (
        <Fragment>
            <Button className='otjs-button otjs-button-blue' onClick={() => setShow(true)} >New Role</Button>
            <Modal id='create' show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create new role</h2>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        <Form>
                            <Form.Label>Name*</Form.Label>
                            <Form.Control type="text" value={name} placeholder='name' onChange={(e) => setName(e.target.value)} required/>
                        </Form>
                    </Row>
                    <RoleForm onSubmitRole={create} />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
}