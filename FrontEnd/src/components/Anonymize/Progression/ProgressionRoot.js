import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import { keys } from '../../../model/Constant'
import apis from '../../../services/apis'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'
import task from '../../../services/task'
import Spinner from '../../CommonComponents/Spinner'
import AnonymizedResults from './AnonymizedResults'
import AnonymizePanelProgress from './AnonymizePanelProgress'

export default () => {

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })

    const [state, setState] = useState({
        success: 0,
        failures: 0,
        numberOfItem: 0,
        details: {}
    })

    const getAnonTask = async () => {
        const taskID = await apis.task.getTaskOfUser(store.username, 'anonymize')
        const anonTask = await task.getTask(taskID[0])
        return anonTask
    }

    const { isLoading } = useCustomQuery(
        [keys.PROGRESSION_KEYS],
        () => getAnonTask(),
        undefined,
        undefined,
        (answer) => {
            let success = 0
            let failures = 0
            answer.details.items.forEach(async item => {
                switch (item.state) {
                    case 'completed':
                        success++
                        break
                    case 'failed':
                        failures++
                        break
                    default:
                        break
                }
            })
            setState((state) => ({
                ...state,
                ['success']: success,
                ['failures']: failures,
                ['numberOfItem']: answer.details.items.length,
                ['details']: answer.details
            }))
        },
        1000
    )

    if (isLoading) return <Spinner />

    return (
        <Row className="align-items-center justify-content-center">
            <Col md={12} className="text-center mb-4" style={{ "max-width": '20%' }}>
                <AnonymizePanelProgress success={state.success} failures={state.failures} numberOfItems={state.numberOfItem} />
            </Col>
            <Col md={12}>
                <AnonymizedResults details={state.details} />
            </Col>
        </Row>
    )
}