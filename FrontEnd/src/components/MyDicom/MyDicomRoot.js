import React, { useEffect } from 'react'
import apis from '../../services/apis'
import { useSelector } from 'react-redux'
import { useCustomQuery } from '../../services/ReactQuery/hooks'
import { keys } from '../../model/Constant'
import Spinner from '../CommonComponents/Spinner'

export default () => {

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
            roleName: state.OrthancTools.name
        }
    })

    const { data : labels, isLoading} = useCustomQuery(
        [keys.ROLES_KEY, store.roleName, keys.LABELS_KEY],
        () => apis.rolelabel.getRoleLabels(store.roleName)
    )

    if (isLoading) return <Spinner/>

    console.log(labels)
    return (
        <>
            In construction
        </>
    )
}