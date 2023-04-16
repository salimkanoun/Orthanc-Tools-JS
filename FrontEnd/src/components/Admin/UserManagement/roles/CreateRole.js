import React, { useState } from 'react'
import { Row, Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

import apis from '../../../../services/apis'
import RoleForm from './RoleForm'
import { useCustomMutation } from '../../../CommonComponents/ReactQuery/hooks'
import { keys } from '../../../../model/Constant'
import { errorMessage, successMessage } from '../../../../tools/toastify'

export default ({ onSubmitRole }) => {

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')

    const mutateCreateRole = useCustomMutation(
        ({ payload }) => apis.role.createRole(payload),
        [[keys.ROLES_KEY]],
        () => {
            successMessage('Role Created')
            setShow(false)
            setName('')
        },
        (error) => errorMessage(error?.errorMessage ?? 'Failed')
    )

    const create = async (formState) => {
        if (name === '') {
            errorMessage('Role name can\'t be empty')
        } else {
            let payload = { ...formState, name: name }
            mutateCreateRole.mutate({ payload })
        }
    }

    return (
        <>
            <Button className='otjs-button otjs-button-blue' onClick={() => setShow(true)} >New Role</Button>
            <Modal id='create' show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create new role</h2>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        <Form>
                            <Form.Label>Name*</Form.Label>
                            <Form.Control type="text" value={name} placeholder='name' onChange={(event) => setName(event.target.value)} required />
                        </Form>
                    </Row>
                    <RoleForm onSubmitRole={create} />
                </Modal.Body>
            </Modal>
        </>
    );
}