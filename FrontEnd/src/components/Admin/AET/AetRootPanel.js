import React, {useEffect, useState} from 'react'
import AetForm from './AetForm'
import apis from '../../../services/apis'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import AetsTable from './AetsTable'

/**
 * Root Panel of AETs options
 */
const AetRootPanel = () => {

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

    console.log(aets)

    if (isLoadingAets) return "Loading...."

    return (
        <>
            <AetsTable aetsData={aets} />
            <AetForm />
        </>
    )
}

export default AetRootPanel