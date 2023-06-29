import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import AnonymizedResults from './AnonymizedResults'
import AnonymizePanelProgress from './AnonymizePanelProgress'

import { useCustomQuery } from '../../../services/ReactQuery/hooks'

import task from '../../../services/task'
import apis from '../../../services/apis'
import { keys } from '../../../model/Constant'

export default () => {

    const username = useSelector(state => state.OrthancTools.username)

    const [currentTaskId, setCurrentTaskId] = useState(null)
    const [successCount, setSuccesCount] = useState(0)
    const [failuresCount, setFailuresCount] = useState(0)
    const [numberOfItems, setNumberOfItems] = useState(0)
    const [items, setItems] = useState([])

    useEffect(() => {
        apis.task.getTaskOfUser(username, 'anonymize').then(tasks => {
            if (Array.isArray(tasks) && tasks.length > 0) {
                setCurrentTaskId(tasks[0])
            }
        })
    }, [])

    useCustomQuery(
        [keys.PROGRESSION_KEYS, keys.ANONYMIZE_KEYS , currentTaskId],
        () => task.getTask(currentTaskId),
        undefined,
        undefined,
        (answer) => {
            if (answer == null) return
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
            setSuccesCount(success)
            setFailuresCount(failures)
            setNumberOfItems(answer?.details?.items.length ?? 0)
            setItems(answer?.details?.items ?? [])
        },
        2000,
        undefined,
        (currentTaskId != null)
    )

    return (
        <Row className="align-items-center justify-content-center">
            <Col md={12} className="text-center mb-4" style={{ "max-width": '20%' }}>
                <AnonymizePanelProgress success={successCount} failures={failuresCount} numberOfItems={numberOfItems} />
            </Col>
            <Col md={12}>
                <AnonymizedResults items={items} />
            </Col>
        </Row>
    )
}