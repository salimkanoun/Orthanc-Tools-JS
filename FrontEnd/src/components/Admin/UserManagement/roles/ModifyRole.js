import React from 'react'

import RoleForm from './RoleForm';
import Spinner from '../../../CommonComponents/Spinner';

import { keys } from '../../../../model/Constant';
import apis from '../../../../services/apis';
import { useCustomQuery } from '../../../../services/ReactQuery/hooks';

export default ({ roleName, onUpdateRole }) => {

    const { data: roleData, isLoading } = useCustomQuery(
        [keys.ROLES_KEY, roleName],
        () => {
            //If condition to avoid requesting null role when unmouting (racing issue)
            if (roleName) return apis.role.getRole(roleName)
        }
    )

    if (isLoading) return <Spinner />

    return (
        <RoleForm data={roleData} onUpdateRole={(role) => onUpdateRole(roleName, role)} />
    );
}