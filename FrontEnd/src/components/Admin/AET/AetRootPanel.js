import React from 'react'
import AetForm from './AetForm'
import apis from '../../../services/apis'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import AetsTable from './AetsTable'

/**
 * Root Panel of AETs options
 */
export default () => {

    const { data: aets, isLoading : isLoadingAets } = useCustomQuery(
        ['aets'],
        () => apis.aets.getAetsExpand(),
        undefined,
        (answer) => {
            return Object.entries(answer).map(([aetName, data]) => ({
                name : aetName,
                ...data
            })
            ) 
        }
    )

    if (isLoadingAets) return "Loading...."

    return (
        <>
            <AetsTable aetsData={aets} />
            <AetForm />
        </>
    )
}