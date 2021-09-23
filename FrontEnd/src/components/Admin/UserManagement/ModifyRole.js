import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import apis from '../../../services/apis'

import RoleForm from './RoleForm'
export default class ModifyRole extends Component {

    state = {
        show: false,
        data: {},
    };

    modify = (roleFormState) => {
        let permission = {
            ...roleFormState,
            name: this.props.name
        }
        apis.role.modifyRole(permission).then( () => {
            toast.success('Modified')
            this.setState({ show: false })
        }).catch(error => toast.error(error.statusText))
    }

    handleClick = () => {
        let permission = {}
        apis.role.getPermission(this.props.name).then(answer => permission = answer[0]).then(() => {
            this.setState({
                data: { ...permission },
                show: true
            })
        }).catch(error => toast.error(error.statusText))
    }

    render = () => {
        return (
            <Fragment>
                <div className="text-center">
                    <button type='button' className='otjs-button otjs-button-orange' name='openModify' onClick={this.handleClick}>Edit</button>
                </div>
                
                <Modal id='modify' show={this.state.show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Modify role {this.state.data.name}</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <RoleForm data={this.state.data} onSubmitRole={this.modify} />
                    </Modal.Body>
                </Modal>
            </Fragment>

        );
    }
}