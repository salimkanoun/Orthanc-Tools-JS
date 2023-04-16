import React from 'react'

import RoleForm from './RoleForm';
import Spinner from '../../../CommonComponents/Spinner';

import { keys } from '../../../../model/Constant';
import { useCustomMutation, useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';
import { errorMessage, successMessage } from '../../../../tools/toastify';
import apis from '../../../../services/apis';

export default ({ roleName, onClose }) => {

    const { data: roleData, isLoading } = useCustomQuery(
        [keys.ROLES_KEY, roleName],
        () => apis.role.getPermission(roleName)
    )

    const mutateRole = useCustomMutation(
        ({ permission }) => apis.role.modifyRole(roleName, permission),
        [[keys.ROLES_KEY, roleName]],
        () => { successMessage('Updated'); onClose() },
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )

    const modify = (permission) => {
        mutateRole.mutate({ permission })
    }

    if (isLoading) return <Spinner />

    return (
        <RoleForm data={roleData} onSubmitRole={modify} />
    );
}