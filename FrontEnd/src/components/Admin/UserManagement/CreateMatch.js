import React, { Fragment, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'

import { keys } from '../../../model/Constant';
import apis from '../../../services/apis'
import { useCustomMutation, useCustomQuery } from '../../CommonComponents/ReactQuery/hooks';
import AssociationTable from './AssociationTable';


export default () => {

    const [show, setShow] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [associedRole, setAssociedRole] = useState('')

    const {data : optionsGroupName, isLoading : isLoadingOptionsGroupName } = useCustomQuery(
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

    const {data : optionsAssociedRole, isLoading : isLoadingOptionsAssociedRole} = useCustomQuery(
        [keys.OPTIONS_ASSOCIED_ROLE_KEY],
        () => apis.role.getRoles(),
        undefined,
        (answer) => {
            return answer.map((role) => {
                return ({
                    value : role.name,
                    label : role.name
                })
            })
        }
    )

    const {date : associations, isLoading : isLoadingAssociations} = useCustomQuery(
        [keys.ASSOCIATIONS_KEY],
        () => apis.ldap.getAllCorrespodences()
    )

    const showModal = (show) => {
        setShow(show)
    }

    const createAssociation = useCustomMutation (
        ({groupNameValue, associedRoleValue}) => {
            apis.ldap.createMatch(groupNameValue, associedRoleValue)
            showModal(false)
        },
        [[keys.ASSOCIATIONS_KEY]],
    )

    const changeGroup = (event) => {
        setGroupName(event)
    }

    const changeRole = (event) => {
        setAssociedRole(event)
    }

    if (isLoadingAssociations || isLoadingOptionsAssociedRole || isLoadingOptionsGroupName) return "Loading CreateMatch"

    console.log(associations, optionsAssociedRole, optionsGroupName)
    
    return (
        <Fragment>
            <Button className='btn btn-primary mr-3 mt-2' onClick={() => showModal(true)}>New
                match
            </Button>
            <Modal show={show} onHide={() => showModal(false)}>
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
                    <Button name='create' className='btn btn-primary' onClick={() => createAssociation.mutate(groupName.value,associedRole.value)}>Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="form-group mr-3 mt-3">
                <AssociationTable associations={associations}/>
            </div>
        </Fragment>

    )
}