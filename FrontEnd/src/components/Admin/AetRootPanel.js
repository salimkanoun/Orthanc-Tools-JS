import React, { Fragment, useState, useEffect } from 'react'
import Aets from './AetsListTable'
import AetForm from './AetForm'

/**
 * Root Panel of AETs options
 */
const AetRootPanel = () => {

    const [aets, setAets] = useState([])

    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
    useEffect( () => {
        refreshAetsData() }, []
    )

    /**
     * Get Aets Data from backend
     */
    async function refreshAetsData(){

        let aetsAnswer = await fetch("/api/aets", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer)=>{
            return answer.json()
        })

        setAets(aetsAnswer)

    }


    return (
        <Fragment>
            <Aets aetsData={aets} refreshAetData={refreshAetsData} />
            <AetForm refreshAetData={refreshAetsData} />
        </Fragment>
    )

}

export default AetRootPanel