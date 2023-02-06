import React, { Fragment, useMemo, useState, useEffect } from "react"
import { Row, Col, Modal, Button } from 'react-bootstrap';

import apis from '../../../services/apis'
import ModifyRole from "./ModifyRole";
import CreateRole from "./CreateRole";
import { toast } from "react-toastify";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

function RoleTable({ roles, onDelete }) {
    const data = useMemo(() => roles, [roles]);
    console.log(data)
    const columns = [
        {
            id : "name",
            accessorKey: 'name',
            header: 'Name',
        }, {
            id : 'id',
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => {
                return <ModifyRole name={row.name} />
            }
        }, {
            id : 'delete',
            accessorKey: 'delete',
            header: 'Delete',
            cell: ({ row }) => {
                return (<div className="text-center">
                    <Button className='otjs-button otjs-button-red' name='openDelete'
                        onClick={() => onDelete(row.values.name)}>Delete</Button>
                </div>)
            }
        }
    ];


    return <CommonTableV8 columns={columns} data={data} />
}

export default ({ }) => {

    const [name, setName] = useState('')
    const [roles, setRoles] = useState([])
    const [showDelete, setShowDelete] = useState(false)

    useEffect(() => {
        getRoles()
    }, [])

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