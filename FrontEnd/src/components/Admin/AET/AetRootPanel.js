import React, {useEffect, useState} from 'react'
import Aets from './AetsListTable'
import AetForm from './AetForm'
import apis from '../../../services/apis'
import {toast} from 'react-toastify'

/**
 * Root Panel of AETs options
 */
const AetRootPanel = () => {

    const [aets, setAets] = useState([])

    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
    useEffect(() => {
        refreshAetsData()
    }, [])

    /**
     * Get Aets Data from backend
     */
    const refreshAetsData = async () => {
        try {
            let aets = await apis.aets.getAetsExpand()
            setAets(aets)
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    return (
        <>
            <Aets aetsData={aets} refreshAetData={refreshAetsData}/>
            <AetForm refreshAetData={refreshAetsData}/>
        </>
    )
}

export default AetRootPanel