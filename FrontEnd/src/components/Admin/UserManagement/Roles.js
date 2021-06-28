import React, {Component, Fragment, useMemo} from "react"
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'
import ModifyRole from "./ModifyRole";
import CreateRole from "./CreateRole";
import {toast} from "react-toastify";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

function RoleTable({roles, onDelete}) {
    const columns = useMemo(() => [
        {
            accessor: 'name',
            Header: 'Name',
            sort: true
        }, {
            accessor: 'edit',
            Header: 'Edit',
            Cell: ({row}) => {
                return <ModifyRole name={row.values.name}/>
            }
        }, {
            accessor: 'delete',
            Header: 'Delete',
            Cell: ({row}) => {
                return <button type='button' className='btn btn-danger' name='openDelete'
                               onClick={() => onDelete(row.values.name)}>Delete</button>
            }
        }
    ], [onDelete]);

    const data = useMemo(() => roles, [roles]);

    return <CommonTable columns={columns} tableData={data}/>
}

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
            this.setState({roles: roles})
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    handleDelete = (name) => {
        this.setState({
            name,
            showDelete: true
        })
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

    render = () => {
        return (
            <Fragment>
                <h2 className='card-title'>Roles Panel</h2>
                <CreateRole onSubmitRole={this.getRoles}/>
                <RoleTable roles={this.state.roles} onDelete={this.handleDelete}/>
                <Modal id='delete' show={this.state.showDelete} onHide={() => this.setState({showDelete: false})}
                       size='sm'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Delete Role</h2>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete {this.state.name} ?
                    </Modal.Body>
                    <Modal.Footer>
                        <button name='delete' type='button' className='btn btn-danger' onClick={this.delete}>Delete
                        </button>
                        <button type='button' className='btn btn-info'
                                onClick={() => this.setState({showDelete: false})}>Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}