import React, { Fragment, useEffect, useState } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap';

import apis from '../../../../services/apis';

import CreateUser from './CreateUser'
import UserTable from "./UserTable";
import { useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../../model/Constant';
import Spinner from '../../../CommonComponents/Spinner';


export default () => {

    const { data: users, isLoading: isLoadingUsers } = useCustomQuery(
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

    const { data: roles, isLoading: isLoadingRoles } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
        (roles) => {
            return roles.map(r => r.name)
        }
    )

    if (isLoadingUsers || isLoadingRoles) return <Spinner />

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
                    <UserTable users={users} roles={roles} />
                </Col>
            </Row>

        </Fragment>

    );
}