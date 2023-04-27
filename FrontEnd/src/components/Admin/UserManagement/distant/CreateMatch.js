import React, { Fragment, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'

import { keys } from '../../../../model/Constant';
import apis from '../../../../services/apis';
import { useCustomMutation, useCustomQuery } from '../../../../services/ReactQuery/hooks';
import { errorMessage } from '../../../../tools/toastify';
import Spinner from '../../../CommonComponents/Spinner';
import AssociationTable from './AssociationTable';


export default () => {

    const [show, setShow] = useState(false)
    const [groupName, setGroupName] = useState(null)
    const [associedRole, setAssociedRole] = useState(null)

    const { data: optionsGroupName, isLoading: isLoadingOptionsGroupName, status: groupNameStatus } = useCustomQuery(
        [keys.OPTIONS_GROUP_NAME_KEY],
        () => apis.ldap.getAllGroupName(),
        undefined,
        (answer) => {
            return answer.map((group) => {
                //SK Ajouter un render de description dans le select ? (info qui vient du LDAP)
                return ({
                    label: group.cn,
                    value: group.cn,
                    description: group.description
                })
            })
        }
    )

    const { data: optionsAssociedRole, isLoading: isLoadingOptionsAssociedRole } = useCustomQuery(
        [keys.OPTIONS_ASSOCIED_ROLE_KEY],
        () => apis.role.getRoles(),
        undefined,
        (answer) => {
            return answer.map((role) => {
                return ({
                    value: role.name,
                    label: role.name
                })
            })
        }
    )

    const { date: associations, isLoading: isLoadingAssociations } = useCustomQuery(
        [keys.ASSOCIATIONS_KEY],
        () => apis.ldap.getAllCorrespodences()
    )

    const createAssociation = useCustomMutation(
        ({ groupNameValue, associedRoleValue }) => apis.ldap.createMatch(groupNameValue, associedRoleValue),
        [[keys.ASSOCIATIONS_KEY]],
        () => {
            setShow(false)
        },
        ()=> {
            //errorMessage('error')
        }
    )

    const changeGroup = (option) => {
        setGroupName(option)
    }

    const changeRole = (option) => {
        setAssociedRole(option)
    }

    if (isLoadingAssociations || isLoadingOptionsAssociedRole || isLoadingOptionsGroupName) return <Spinner/>

    return (
        <Fragment>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create new match</h2>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Group name</Form.Label>
                        <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                            options={optionsGroupName} onChange={changeGroup}
                            value={groupName} required />
                        <Form.Label>Associed role</Form.Label>
                        <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                            options={optionsAssociedRole} onChange={changeRole}
                            value={associedRole} required />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button name='create' className='btn btn-primary' onClick={() => createAssociation.mutate(groupName.value, associedRole.value)}>Create
                    </Button>
                </Modal.Footer>
            </Modal>
            {
                groupNameStatus === 'success' ?
                    <div className="form-group mr-3 mt-3">
                        <Button className='btn btn-primary mr-3 mt-2' onClick={() => setShow(true)}>New
                            match
                        </Button>
                        <AssociationTable associations={associations} />
                    </div>
                    :
                    null
            }
        </Fragment>
    )
}