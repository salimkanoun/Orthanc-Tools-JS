import React, { Fragment, useMemo, useState } from "react"
import { Row, Col, Modal, Button } from 'react-bootstrap';

import apis from '../../../services/apis'
import ModifyRole from "./ModifyRole";
import CreateRole from "./CreateRole";
import { toast } from "react-toastify";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

function RoleTable({ roles, onDelete }) {
    const columns = useMemo(() => [
        {
            accessor: 'name',
            Header: 'Name',
            sort: true
        }, {
            accessor: 'edit',
            Header: 'Edit',
            Cell: ({ row }) => {
                return <ModifyRole name={row.values.name} />
            }
        }, {
            accessor: 'delete',
            Header: 'Delete',
            Cell: ({ row }) => {
                return (<div className="text-center">
                    <Button className='otjs-button otjs-button-red' name='openDelete'
                        onClick={() => onDelete(row.values.name)}>Delete</Button>
                </div>)
            }
        }
    ], [onDelete]);

    const data = useMemo(() => roles, [roles]);

    return <CommonTable columns={columns} data={data} />
}

export default ({ }) => {

    const [name, setName] = useState('')
    const [roles, setRoles] = useState([])
    const [showDelete, setShowDelete] = useState(false)

    const componentDidMount = () => {
        getRoles()
    }

    const getRoles = async () => {
        try {
            let roles = await apis.role.getRoles()
            setRoles(roles)
        } catch (error) {
            toast.error(error.statusText, {data:{type:'notification'}})
        }

    }

    const handleDelete = (name) => {
        setName(name)
        setShowDelete(true)
    }

    const deletes = () => {
        apis.role.deleteRole(name).then(() => {
            toast.success('Deleted', {data:{type:'notification'}})
            onHide()
        }).catch(error => toast.error(error.statusText, {data:{type:'notification'}}))
    }

    const onHide = () => {
        setName('')
        setShowDelete(false)
        getRoles()
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <h2 className='card-title'>Roles Panel</h2>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <CreateRole onSubmitRole={getRoles} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <RoleTable roles={roles} onDelete={handleDelete} />
                </Col>
            </Row>


            <Modal id='delete' show={showDelete} onHide={() => setShowDelete(false)}
                size='sm'>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Delete Role</h2>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are You sure to delete {name} ?
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Row>
                        <Col>
                            <Button className='otjs-button otjs-button-blue'
                                onClick={() => setShowDelete(false)}>Close
                            </Button>
                        </Col>
                        <Col>
                            <Button name='delete' className='otjs-button otjs-button-red' onClick={deletes}>Delete
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}