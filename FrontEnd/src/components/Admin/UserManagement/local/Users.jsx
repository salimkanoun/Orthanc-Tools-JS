import React, { Fragment, useState } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap';

import UserTable from "./UserTable";
import UserForm from './UserForm';
import Spinner from '../../../CommonComponents/Spinner';

import { keys } from '../../../../model/Constant';
import apis from '../../../../services/apis';
import { errorMessage, successMessage } from '../../../../tools/toastify';
import { useCustomMutation, useCustomQuery } from '../../../../services/ReactQuery/hooks';

export default () => {

    const [editUser, setEditUser] = useState(null)
    const [showCreate, setShowCreate] = useState(false)

    const createUserMutation = useCustomMutation(
        ({ username, firstname, lastname, password, email, role, superAdmin }) => {
            return apis.User.createUser(username, firstname, lastname, password, email, role, superAdmin)
        },
        [[keys.USERS_KEY]],
        () => {
            successMessage('Created');
            setShowCreate(false)
        },
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )

    const { data: users, isLoading: isLoadingUsers } = useCustomQuery(
        [keys.USERS_KEY],
        () => apis.User.getUsers(),
        undefined
    )

    const { data: roles, isLoading: isLoadingRoles } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
        (roles) => {
            return roles.map(r => r.name)
        }
    )

    const modifyMutation = useCustomMutation(
        ({ username, firstname, lastname, email, role, password, superAdmin }) => apis.User.modifyUser(username, firstname, lastname, email, role, password, superAdmin),
        [[keys.USERS_KEY]],
        () => {
            successMessage('Updated')
            setEditUser(null)
        },
        (error) => errorMessage(error?.data?.errorMessage)
    )

    const checkUserData = (userData) => {
        if (userData.role === '' ||
            userData.username === '' ||
            userData.password === '') {
            errorMessage('Please fill all required input')
            return false
        }
        return true
    }

    const createUser = (userData) => {
        if (checkUserData(userData)) {
            createUserMutation.mutate(userData)
        }
    }

    const modifyUser = (userData) => {
        if (checkUserData(userData)) {
            modifyMutation.mutate(userData)
        }
    }

    if (isLoadingUsers || isLoadingRoles) return <Spinner />

    return (
        <Fragment>
            <Modal id='create' show={showCreate} onHide={() => setShowCreate(false)} size='md'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create User</h2>
                </Modal.Header>
                <Modal.Body>
                    <UserForm onValidate={(data) => createUser(data)}>
                        <Button className='otjs-button otjs-button-blue'>Create</Button>
                    </UserForm>
                </Modal.Body>
            </Modal>

            <Modal id='modify' show={editUser != null} onHide={() => setEditUser(null)} size='md'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Modify User</h2>
                </Modal.Header>
                <Modal.Body>
                    <UserForm data={users.find(user => user.username === editUser)} onValidate={(data) => modifyUser(data)}>
                        <Button className='otjs-button otjs-button-blue'>Update</Button>
                    </UserForm>
                </Modal.Body>
            </Modal>
            <Row>
                <h2 className='card-title'>Local Users</h2>
            </Row>
            <Row className="mt-5">
                <Col>
                    <Button onClick={() => setShowCreate(true)} className='otjs-button otjs-button-blue'>Create</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <UserTable users={users} onEditClick={(username) => setEditUser(username)} roles={roles} />
                </Col>
            </Row>
        </Fragment>
    );
}