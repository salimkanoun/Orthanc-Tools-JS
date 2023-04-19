import React from 'react'
import AetForm from './AetForm'
import apis from '../../../services/apis'
import AetsTable from './AetsTable'
import { keys } from '../../../model/Constant'
import Spinner from '../../CommonComponents/Spinner'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'

/**
 * Root Panel of AETs options
 */
export default () => {

    const { data: aets, isLoading: isLoadingAets } = useCustomQuery(
        [keys.AETS_KEY],
        () => apis.aets.getAetsExpand(),
        undefined,
        (answer) => {
            return Object.entries(answer).map(([aetName, data]) => ({
                name: aetName,
                ...data
            })
            )
        }
    )

    if (isLoadingAets) return <Spinner/>

    return (
        <>
            <AetsTable aetsData={aets} />
            <AetForm />
        </>
    )
}