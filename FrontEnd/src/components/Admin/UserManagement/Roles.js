import React, { Component, Fragment } from "react"
import BootstrapTable from 'react-bootstrap-table-next';
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'
import ModifyRole from "./ModifyRole";
import CreateRole from "./CreateRole";
import { toast } from "react-toastify";

export default class Roles extends Component {

    state = {
        name: '',
        roles: [],
        showDelete: false
    };

    componentDidMount = () => {
        this.getRoles()
    }

    getRoles = async () => {
        try {
            let roles = await apis.role.getRoles()
            this.setState({ roles: roles })
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    delete = () => {
        apis.role.deleteRole(this.state.name).then(() => {
            toast.success('Deleted')
            this.onHide()
        }).catch(error => toast.error(error.statusText))
    }

    onHide = () => {
        this.setState({
            name: '',
            showDelete: false
        })
        this.getRoles()
    }

    columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'edit',
            text: 'Edit',
            formatter: (cell, row, index) => {
                return <ModifyRole name={row.name} />
            }
        }, {
            dataField: 'delete',
            text: 'Delete',
            formatter: (cell, row, index) => {
                return <button type='button' className='btn btn-danger' name='openDelete' onClick={() => {
                    this.setState({
                        name: row.name,
                        showDelete: true
                    })
                }} >Delete</button>
            }
        }
    ]

    render = () => {
        return (
            <Fragment>
                <h2 className='card-title'>Roles Panel</h2>
                <CreateRole onSubmitRole={this.getRoles} />
                <BootstrapTable keyField='name' data={this.state.roles} columns={this.columns} striped wrapperClasses='table-responsive' />

                <Modal id='delete' show={this.state.showDelete} onHide={() => this.setState({ showDelete: false })} size='sm'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Delete Role</h2>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete {this.state.name} ?
                    </Modal.Body>
                    <Modal.Footer>
                        <button name='delete' type='button' className='btn btn-danger' onClick={this.delete}>Delete</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({ showDelete: false })}>Close</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}