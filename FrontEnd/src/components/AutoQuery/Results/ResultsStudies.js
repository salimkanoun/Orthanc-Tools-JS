import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableQueryResultStudies from '../../CommonComponents/RessourcesDisplay/ReactTableV8/TableQueryResultStudies'

export default () => {

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
        }
    })

    return (
        < TableQueryResultStudies studies={Object.values(store.results)} />
    )
}