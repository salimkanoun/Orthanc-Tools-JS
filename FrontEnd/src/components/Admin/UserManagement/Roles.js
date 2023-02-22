import React, { Fragment, useState } from "react"
import { Row, Col, Modal, Button } from 'react-bootstrap';

import apis from '../../../services/apis'
import CreateRole from "./CreateRole";
import { toast } from "react-toastify";
import { useCustomQuery } from "../../CommonComponents/ReactQuery/hooks";
import RoleTable from "../UserManagement/RoleTable";
import { keys } from "../../../model/Constant";


export default () => {

    const [name, setName] = useState('')
    const [showDelete, setShowDelete] = useState(false)


    const { data: roles, isLoading : isLoadingRoles, refetch : refetchRole } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
    )

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
        refetchRole()
    }
    
    if (isLoadingRoles) return "Loading roles"

    return (
        <Fragment>
            <Row>
                <Col>
                    <h2 className='card-title'>Roles Panel</h2>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <CreateRole onSubmitRole={refetchRole()} />
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