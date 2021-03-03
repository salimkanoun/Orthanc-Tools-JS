import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import { toast } from 'react-toastify';

import BootstrapTable from 'react-bootstrap-table-next';

import apis from '../../../services/apis'


export default class CreateMatch extends Component {

    state = {
        show: false,
        groupName: '',
        associedRole: '',
        optionsAssociedRole: [],
        optionsGroupName: [],
        matches : []
    }

    componentDidMount = async () => {
        try {
            let optionsGroupName = await this.getExistingGroupOptions()
            
            let optionGroupRole = await this.getAssociedRole()
            console.log(optionGroupRole)
            console.log(optionsGroupName)
            this.setState({
                optionsAssociedRole: optionGroupRole,
                optionsGroupName: optionsGroupName
            })
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    columns = [
        {
            dataField: 'groupName',
            text: 'Group name',
            sort: true
        }, {
            dataField: 'associedRole',
            text: 'Associed role',
        }, {
            dataField: 'delete',
            text: 'Delete',
            editable: false,
            formatExtraData: this,
            formatter: (cell, row, index, parentComponent) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={() => { parentComponent.delete(row.groupName) }} >Delete</button>
            }
        }
    ]

    changeGroupe = (event) => {
        this.setState({ groupName: event })
    }

    changeRole = (event) => {
        this.setState({ associedRole: event })
    }

    getAssociedRole = async () => {
        let roles = []
        try {
            let existingsRoles = await apis.role.getRoles()
            existingsRoles.map( (role) => {
                roles.push({value : role.name, label : role.name})
            })
        } catch (error) {
            toast.error(error.statusText)
        }
        
        return roles

    }

    create = async () => {
        await apis.ldap.createMatch(this.state.groupName.value, this.state.associedRole.value).then(() => {
            toast.success('Ldap Match Created')
            this.props.getMatches()
            this.setState({
                show: false,
            })

        }).catch(error => { toast.error(error.statusText) })
    }

    getExistingGroupOptions = async () => {
        try {
            let answer = await apis.ldap.getAllGroupName()
            let options = answer.map((group) => {
                return {label : group, value : group}
            })
            return options
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    //SK A VOIR
    delete = (groupName) => {
        apis.ldap.deleteMatch(groupName).then(() => {
            toast.success('Match deleted with success')
            this.getMatches()
        }).catch(error => {
            toast.error(error.statusText)
        })
    }

    render = () => {
        return (
            <Fragment>
                <button type='button' className='btn btn-primary mr-3 mt-2' onClick={() => this.setState({ show: true })} >New match</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new match</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Fragment>
                            <label>Group name</label>
                            <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsGroupName} onChange={this.changeGroupe} value={this.state.groupName} required />

                            <label className='mt-3'>Associed role</label>
                            <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsAssociedRole} onChange={this.changeRole} value={this.state.associedRole} required />
                        </Fragment>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({ show: false })} >Cancel</button>
                    </Modal.Footer>
                </Modal>

                <div className="form-group mr-3 mt-3">
                    <BootstrapTable keyField='groupName' data={this.state.matches} columns={this.columns} striped />
                </div>
            </Fragment>

        );
    }
}