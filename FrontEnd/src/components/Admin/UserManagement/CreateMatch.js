import React, {Component, Fragment, useMemo} from 'react'
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import {toast} from 'react-toastify';

import apis from '../../../services/apis'
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


function AssociationTable({associations, deleteAssociation}) {
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
            Cell: ({row}) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={() => {
                    deleteAssociation(row.values.ldapGroup)
                }}>Delete</button>
            }
        }
    ], [deleteAssociation]);
    const data = useMemo(() => associations, [associations]);
    return <CommonTable tableData={data} columns={columns}/>
}

export default class CreateMatch extends Component {

    state = {
        show: false,
        groupName: '',
        associedRole: '',
        optionsAssociedRole: [],
        optionsGroupName: [],
        associations: []
    }

    componentDidMount = async () => {

        try {
            let optionsGroupName = await this.getExistingGroupOptions()
            let optionGroupRole = await this.getAssociedRole()
            let associations = await this.getExistingAssociations()

            this.setState({
                optionsAssociedRole: optionGroupRole,
                optionsGroupName: optionsGroupName,
                associations: associations
            })
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    getExistingAssociations = async () => {
        return await apis.ldap.getAllCorrespodences()
    }

    changeGroup = (event) => {
        this.setState({groupName: event})
    }

    changeRole = (event) => {
        this.setState({associedRole: event})
    }

    getAssociedRole = async () => {
        let roles = []
        try {
            let existingsRoles = await apis.role.getRoles()
            existingsRoles.forEach((role) => {
                roles.push({value: role.name, label: role.name})
            })
        } catch (error) {
            toast.error(error.statusText)
        }

        return roles

    }

    create = async () => {
        try {
            await apis.ldap.createMatch(this.state.groupName.value, this.state.associedRole.value)
            toast.success('Association Created')
            this.setState({
                associations: await this.getExistingAssociations()
            })
            this.showModal(false)

        } catch (error) {
            toast.error(error.statusText)
        }
    }

    getExistingGroupOptions = async () => {
        try {
            let answer = await apis.ldap.getAllGroupName()
            let options = answer.map((group) => {
                //SK Ajouter un render de description dans le select ? (info qui vient du LDAP)
                return {label: group.cn, value: group.cn, description: group.description}
            })
            return options
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    showModal = (show) => {
        this.setState({show: show})
    }

    delete = async (ldapGroup) => {
        try {
            await apis.ldap.deleteMatch(ldapGroup)
            toast.success('Assocication deleted')
            this.setState({
                associations: await this.getExistingAssociations()
            })
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    render = () => {
        return (
            <Fragment>
                <button type='button' className='btn btn-primary mr-3 mt-2' onClick={() => this.showModal(true)}>New
                    match
                </button>
                <Modal show={this.state.show} onHide={() => this.showModal(false)}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new match</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Fragment>
                            <label>Group name</label>
                            <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                                    options={this.state.optionsGroupName} onChange={this.changeGroup}
                                    value={this.state.groupName} required/>
                            <label className='mt-3'>Associed role</label>
                            <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single
                                    options={this.state.optionsAssociedRole} onChange={this.changeRole}
                                    value={this.state.associedRole} required/>
                        </Fragment>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create}>Create
                        </button>
                    </Modal.Footer>
                </Modal>

                <div className="form-group mr-3 mt-3">
                    <AssociationTable associations={this.state.associations} deleteAssociation={this.delete}/>
                </div>
            </Fragment>

        )
    }
}