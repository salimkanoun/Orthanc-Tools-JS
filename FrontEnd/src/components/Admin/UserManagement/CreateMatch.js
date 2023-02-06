import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import { toast } from 'react-toastify';

import apis from '../../../services/apis'
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


function AssociationTable({ associations, deleteAssociation }) {
    const columns = useMemo(() => [
        {
            accessor: 'ldapGroup',
            Header: 'Group name',
            sort: true
        }, {
            accessor: 'localRole',
            Header: 'Associed role',
        }, {
            accessor: 'delete',
            Header: 'Delete',
            Cell: ({ row }) => {
                return <Button name='delete' className='btn btn-danger' onClick={() => {
                    deleteAssociation(row.values.ldapGroup)
                }}>Delete</Button>
            }
        }
    ], [deleteAssociation]);
    const data = useMemo(() => associations, [associations]);
    return <CommonTable data={data} columns={columns} />
}

export default ({ }) => {

    const [show, setShow] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [associedRole, setAssociedRole] = useState('')
    const [optionsAssociedRole, setOptionsAssociedRole] = useState([])
    const [optionsGroupName, setOptionsGroupName] = useState([])
    const [associations, setAssociations] = useState([])

    useEffect(() => {
        const getOptionsGroupName = async () => { await getExistingGroupOptions()}
        const getOptionGroupRole  = async () => {await getAssociedRole()}
        const getAssociations = async () => {await getExistingAssociations()}
        try {
            let optionsGroupName = getOptionsGroupName()
            let optionGroupRole = getOptionGroupRole()
            let associations = getAssociations()

            setOptionsAssociedRole(optionGroupRole)
            setOptionsGroupName(optionsGroupName)
            setAssociations(associations)
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }, []);


    const getExistingAssociations = async () => {
        return await apis.ldap.getAllCorrespodences()
    }

    const changeGroup = (event) => {
        setGroupName(event)
    }

    const changeRole = (event) => {
        setAssociedRole(event)
    }

    const getAssociedRole = async () => {
        let roles = []
        try {
            let existingsRoles = await apis.role.getRoles()
            existingsRoles.forEach((role) => {
                roles.push({ value: role.name, label: role.name })
            })
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }

        return roles

    }

    const create = async () => {
        try {
            await apis.ldap.createMatch(groupName.value, associedRole.value)
            toast.success('Association Created', { data: { type: 'notification' } })
            setAssociations(await getExistingAssociations())
            showModal(false)

        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }

    const getExistingGroupOptions = async () => {
        try {
            let answer = await apis.ldap.getAllGroupName()
            let options = answer.map((group) => {
                //SK Ajouter un render de description dans le select ? (info qui vient du LDAP)
                return { label: group.cn, value: group.cn, description: group.description }
            })
            return options
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }

    }

    const showModal = (show) => {
        setShow(show)
    }

    const deletef = async (ldapGroup) => {
        try {
            await apis.ldap.deleteMatch(ldapGroup)
            toast.success('Assocication deleted', { data: { type: 'notification' } })
            setAssociations(await getExistingAssociations())
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }

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
                    <Fragment>
                        <label>Group name</label>
                        <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                            options={optionsGroupName} onChange={changeGroup}
                            value={groupName} required />
                        <label className='mt-3'>Associed role</label>
                        <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                            options={optionsAssociedRole} onChange={changeRole}
                            value={associedRole} required />
                    </Fragment>
                </Modal.Body>
                <Modal.Footer>
                    <Button name='create' className='btn btn-primary' onClick={create}>Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="form-group mr-3 mt-3">
                <AssociationTable associations={associations} deleteAssociation={deletef} />
            </div>
        </Fragment>

    )
}