import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

import apis from '../../../../services/apis';
import { useCustomMutation } from '../../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../../model/Constant';
import UserForm from './UserForm';

export default () => {

    const [show, setShow] = useState(false)

    const createUser = async (state, role) => {
        if (role === '' ||
            state.username === '' ||
            state.password === '') {
            toast.error('Please fill all required input', { data: { type: 'notification' } })
        } else {
            createUserMutation.mutate(state.username, state.firstname, state.lastname, state.password, state.email, role, state.superAdmin)
        }
    }

    const createUserMutation = useCustomMutation(
        ({ username, firstname, lastname, password, email, role, superAdmin }) => {
            apis.User.createUser(username, firstname, lastname, password, email, role, superAdmin)
            setShow(false)
        },
        [[keys.USERS_KEY]],
    )


    return (
        <>
            <Button name='create' className='otjs-button otjs-button-blue'
                onClick={() => setShow(true)}>New User
            </Button>
            <UserForm show={show} setShow={setShow} create queryFunction={createUser} />
        </>
    );
}