import React from 'react'
import Select from 'react-select'
import { keys } from '../../../model/Constant'
import apis from '../../../services/apis'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import Spinner from '../../CommonComponents/Spinner'

export default ({ onChange, value }) => {

    const { data: optionRoles, isLoading } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
        (answer) => {
            return answer.map((role) => {
                return ({
                    value: role.name,
                    label: role.name
                })
            })
        }
    )

    if (isLoading) return <Spinner />

    return (
        <Select value={optionRoles.find((option) => option.value === value)} single options={optionRoles} onChange={onChange} />
    )

}