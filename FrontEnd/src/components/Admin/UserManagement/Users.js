import React, { Fragment, useEffect, useState } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap';

import apis from '../../../services/apis';

import CreateUser from './CreateUser'
import { toast } from 'react-toastify';
import UserTable from "./UserTable";
import { useCustomMutation, useCustomQuery } from '../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../model/Constant';


export default () => {

    const [username, setUsername] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [userId, setUserId] = useState();

    const { data: users, isLoading : isLoadingUsers } = useCustomQuery(
        [keys.USERS_KEY],
        () => apis.User.getUsers(),
        undefined,
        (answer) => {
            return answer.map((user) => {
                return ({
                    ...user,
                    password: ''
                })
            })
        }
    )

    const deleteUser = useCustomMutation(
        ({username}) =>  apis.User.deleteUser(username),
        [[keys.USERS_KEY]]
    )

    const { data : roles, isLoading : isLoadingRoles } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
        (roles) => {
            return roles.map(r => r.name)
        }
    )


    const resetState = () => {
        setShowDelete(false)
    }

    const modify = async (row) => {

        let password = row.password == null ? null : row.password

        await apis.User.modifyUser(
            row.username,
            row.firstname,
            row.lastname,
            row.email,
            row.role,
            password,
            row.superAdmin
        ).then(() => {
            toast.success('User modified', { data: { type: 'notification' } })
            resetState()
        }).catch((error) => toast.error(error.statusText, { data: { type: 'notification' } }))
    }


    const changeHandler = (initialValue, value, row, column) => {
        let users = [...users];
        users.find(user => user.username === row.username)[column] = value;
    }
    
    if (isLoadingUsers || isLoadingRoles) return "Loading ..."

    return (
        <Fragment>
            <Row>
                <h2 className='card-title'>Local Users</h2>
            </Row>
            <Row className="mt-5">
                <Col>
                    <CreateUser />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <UserTable users={users} roles={roles} modify={modify}
                        setDelete={(username, userId) => {
                            setUsername(username);
                            setUserId(userId);
                            setShowDelete(true);
                        }} onUserUpdate={changeHandler} />
                </Col>
            </Row>
            <Modal id='delete' show={showDelete} onHide={resetState} size='sm'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Delete User</h2>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are You sure to delete {username} ?
                </Modal.Body>
                <Modal.Footer>
                    <Row className="text-center mt-2">
                        <Col>
                            <Button className='otjs-button otjs-button-blue'
                                onClick={() => setShowDelete(false)}>Close
                            </Button>
                        </Col>
                        <Col>
                            <Button className='otjs-button otjs-button-red' onClick={() => deleteUser({username}) }>Delete</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>

        </Fragment>

    );
}