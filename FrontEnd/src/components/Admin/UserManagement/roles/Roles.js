import React, { Fragment, useState } from "react"

import { Row, Col, Modal, Button } from 'react-bootstrap';

import CreateRole from "./CreateRole";
import RoleTable from "./RoleTable";
import ModifyRole from "./ModifyRole";
import Spinner from "../../../CommonComponents/Spinner";
import { confirm } from "../../../CommonComponents/ConfirmGlobal";

import { keys } from "../../../../model/Constant";
import apis from "../../../../services/apis";
import { errorMessage, successMessage } from "../../../../tools/toastify";
import { useCustomMutation, useCustomQuery } from "../../../../services/ReactQuery/hooks";

export default () => {

    const [modifyRole, setModifyRole] = useState(null)
    const [showCreate, setShowCreate] = useState(false)

    const { data: roles, isLoading: isLoadingRoles } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
    )

    const deleteRole = useCustomMutation(
        ({ roleName }) => apis.role.deleteRole(roleName),
        [[keys.ROLES_KEY]],
        () => successMessage('Role Deleted'),
        (error) => errorMessage(error?.errorMessage ?? "Failed")
    )

    const mutateRole = useCustomMutation(
        ({ roleName, permission }) => apis.role.modifyRole(roleName, permission),
        [[keys.ROLES_KEY]],
        () => successMessage('Updated'),
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )


    const onUpdateRole = (roleName, permission) => {
        mutateRole.mutate({ roleName, permission })
        setModifyRole(null)
    }

    const onDeleteRole = async (roleName) => {
        if (await confirm({ title: "Delete Role", message: "Delete Role " + roleName + " ?" })) {
            deleteRole.mutate({ roleName })
        }
    }

    if (isLoadingRoles) return <Spinner />

    return (
        <Fragment>
            <Row>
                <Col>
                    <h2 className='card-title'>Roles Panel</h2>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Button className='otjs-button otjs-button-blue' onClick={() => setShowCreate(true)} >New Role</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <RoleTable roles={roles} onOpenModify={(name) => setModifyRole(name)} onDelete={onDeleteRole} />
                </Col>
            </Row>

            <Modal id='create' show={showCreate} onHide={() => setShowCreate(false)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Create new role</h2>
                </Modal.Header>
                <Modal.Body>
                    <CreateRole onClose = {()=>setShowCreate(false)}/>
                </Modal.Body>
            </Modal>

            <Modal id='modify' show={modifyRole != null} onHide={() => setModifyRole(null)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Modify role {modifyRole}</h2>
                </Modal.Header>
                <Modal.Body>
                    <ModifyRole roleName={modifyRole} onUpdateRole={onUpdateRole} />
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}