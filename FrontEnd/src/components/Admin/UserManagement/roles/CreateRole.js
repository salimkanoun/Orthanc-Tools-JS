import React, { useState } from 'react'
import { Row, Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

import apis from '../../../../services/apis'
import RoleForm from './RoleForm'
import { keys } from '../../../../model/Constant'
import { errorMessage, successMessage } from '../../../../tools/toastify'
import { useCustomMutation } from '../../../../services/ReactQuery/hooks'

export default ({ onClose }) => {

    const [name, setName] = useState('')

    const mutateCreateRole = useCustomMutation(
        ({ payload }) => apis.role.createRole(payload),
        [[keys.ROLES_KEY]],
        () => {
            successMessage('Role Created')
            onClose()
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
            <Row className="align-items-center">
                <Form>
                    <Form.Label>Name*</Form.Label>
                    <Form.Control type="text" value={name} placeholder='name' onChange={(event) => setName(event.target.value)} required />
                </Form>
            </Row>
            <RoleForm onUpdateRole={create} />
        </>
    );
}