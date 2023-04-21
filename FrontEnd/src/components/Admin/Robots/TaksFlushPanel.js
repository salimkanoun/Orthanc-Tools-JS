import React from "react"
import { Row, Col, Button, Form } from 'react-bootstrap'

import apis from '../../../services/apis'
import { confirm } from "../../CommonComponents/ConfirmGlobal"
import { keys } from "../../../model/Constant"
import { successMessage } from "../../../tools/toastify"
import { useCustomMutation } from "../../../services/ReactQuery/hooks"

export default () => {

    const RETRIEVE = 'retrieve'
    const ANONYMIZE = 'anonymize'
    const DELETE = 'delete'
    const EXPORT = 'export'

    const flushRetrieve = useCustomMutation(
        () => apis.retrieveRobot.flush(),
        [[keys.ROBOTS_KEY]],
        () => successMessage('Flushed')
    )

    const flushAnonymize = useCustomMutation(
        () => apis.anon.flush(),
        [[keys.ROBOTS_KEY]],
        () => successMessage('Flushed')
    )

    const flushDelete = useCustomMutation(
        () => apis.deleteRobot.flush(),
        [[keys.ROBOTS_KEY]],
        () => successMessage('Flushed')
    )

    const flushExport = useCustomMutation(
        () => apis.exportDicom.flushExternalExport(),
        [[keys.ROBOTS_KEY]],
        () => successMessage('Flushed')
    )

    const clickHandler = async (flushType) => {
        if (await confirm({ message: 'Warning : there is no check on the flush for the progression of the task. It empties the queues without discrimination' })) {
            switch (flushType) {
                case RETRIEVE:
                    flushRetrieve.mutate();
                    break;
                case ANONYMIZE:
                    flushAnonymize.mutate();
                    break;
                case DELETE:
                    flushDelete.mutate();
                    break;
                case EXPORT:
                    flushExport.mutate();
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <Form>
            <Row>
                <Col>
                    <Button variant="danger" onClick={() => clickHandler(ANONYMIZE)}> Flush Anon Tasks </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={() => clickHandler(DELETE)}> Flush Delete tasks </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={() => clickHandler(EXPORT)}> Flush Export tasks </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={() => clickHandler(RETRIEVE)}> Flush Retrieve task </Button>
                </Col>
            </Row>
        </Form>
    )
}