import React, {Component, Fragment, useMemo} from "react"
import {Row, Col, Modal} from 'react-bootstrap';

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
                return (<div className="text-center">
                            <button type='button' className='otjs-button otjs-button-red' name='openDelete'
                               onClick={() => onDelete(row.values.name)}>Delete</button>
                        </div>)
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
                <Row>
                    <Col>
                        <h2 className='card-title'>Roles Panel</h2>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <CreateRole onSubmitRole={this.getRoles}/>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <RoleTable roles={this.state.roles} onDelete={this.handleDelete}/>
                    </Col>
                </Row>
                
               
                <Modal id='delete' show={this.state.showDelete} onHide={() => this.setState({showDelete: false})}
                       size='sm'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Delete Role</h2>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        Are You sure to delete {this.state.name} ?
                    </Modal.Body>
                    <Modal.Footer className="text-center">
                        <Row>
                            <Col>
                                <button type='button' className='otjs-button otjs-button-blue'
                                    onClick={() => this.setState({showDelete: false})}>Close
                                </button>
                            </Col>
                            <Col>
                                <button name='delete' type='button' className='otjs-button otjs-button-red' onClick={this.delete}>Delete
                                </button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}