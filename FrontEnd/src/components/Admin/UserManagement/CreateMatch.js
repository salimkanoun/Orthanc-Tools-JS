import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import { toast } from 'react-toastify';

import apis from '../../../services/apis'


export default class CreateMatch extends Component {

    state = {
        show: false,
        groupName: '',
        associedRole: '',
        optionsAssociedRole: [],
        optionsGroupName: []
    }

    componentDidMount = async () => {
        try{
            let groupName  = await apis.ldap.getAllGroupName()
            let roles = await this.getAssociedRole()

            this.setState({
                optionsAssociedRole: roles,
                optionsGroupName: groupName
            })
        }catch(error){
            toast.error(error.statusText)
        }

    }

    changeGroupe = (event) => {
        this.setState({ groupName: event })
    }

    changeRole = (event) => {
        this.setState({ associedRole: event })
    }

    getAssociedRole = async () => {
        let roles = []
        let list = await apis.role.getRoles()
        for (let i = 0; i < list.length; i++) {
            roles.push({ value: list[i].name, label: list[i].name })
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

    render = () => {
        return (
            <Fragment>
                <button type='button' hidden={this.props.show} className='btn btn-primary mr-3 mt-2' onClick={() => this.setState({ show: true })} >New match</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new match</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Group name</label>
                        <Select name="typeGroupe" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsGroupName} onChange={this.changeGroupe} value={this.state.groupName} required />

                        <label className='mt-3'>Associed role</label>
                        <Select name="typeGroupe" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsAssociedRole} onChange={this.changeRole} value={this.state.associedRole} required />

                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({ show: false })} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>

        );
    }
}