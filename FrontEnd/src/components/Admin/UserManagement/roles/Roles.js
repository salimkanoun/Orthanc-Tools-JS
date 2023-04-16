import React, { Fragment, useState } from "react"

import { Row, Col, Modal } from 'react-bootstrap';

import CreateRole from "./CreateRole";
import RoleTable from "./RoleTable";
import ModifyRole from "./ModifyRole";
import Spinner from "../../../CommonComponents/Spinner";
import { confirm } from "../../../CommonComponents/ConfirmGlobal";

import { useCustomMutation, useCustomQuery } from "../../../CommonComponents/ReactQuery/hooks";
import { keys } from "../../../../model/Constant";
import apis from "../../../../services/apis";
import { errorMessage, successMessage } from "../../../../tools/toastify";

export default () => {

    const [modifyRole, setModifyRole] = useState(null)

    const { data: roles, isLoading: isLoadingRoles, refetch: refetchRole } = useCustomQuery(
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
                    <CreateRole onSubmitRole={refetchRole()} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <RoleTable roles={roles} onOpenModify={(name) => setModifyRole(name)} onDelete={onDeleteRole} />
                </Col>
            </Row>

            <Modal id='modify' show={modifyRole != null} onHide={() => setModifyRole(null)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Modify role {modifyRole}</h2>
                </Modal.Header>
                <Modal.Body>
                    <ModifyRole roleName={modifyRole} onClose={() => setModifyRole(null)} />
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}